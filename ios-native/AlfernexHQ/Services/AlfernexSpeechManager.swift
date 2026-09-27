import Foundation
import AVFoundation
import Speech
import Combine

public class AlfernexSpeechManager: NSObject, ObservableObject, AVSpeechSynthesizerDelegate {
    public static let shared = AlfernexSpeechManager()
    
    // Published states
    @Published public var isSpeaking: Bool = false
    @Published public var isListening: Bool = false
    @Published public var liveUserSpeech: String = ""
    @Published public var permissionGranted: Bool = false
    
    private let synthesizer = AVSpeechSynthesizer()
    private var onFinishSpeaking: (() -> Void)?
    
    #if os(iOS)
    private var speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "es-PE")) ?? SFSpeechRecognizer(locale: Locale(identifier: "es-ES"))
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    private var silenceTimer: Timer?
    #endif
    
    public override init() {
        super.init()
        synthesizer.delegate = self
        setupAudioSession()
    }
    
    public func setupAudioSession() {
        #if os(iOS)
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playAndRecord, mode: .voiceChat, options: [.defaultToSpeaker, .allowBluetooth])
            try session.setActive(true, options: .notifyOthersOnDeactivation)
        } catch {
            print("Audio session setup error: \(error)")
        }
        #endif
    }
    
    // MARK: - Speech Synthesis (Text to Speech)
    public func speak(text: String, pitch: Float = 1.0, rate: Float = 0.52, onFinish: (() -> Void)? = nil) {
        setupAudioSession()
        
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
        
        self.onFinishSpeaking = onFinish
        self.isSpeaking = true
        
        let utterance = AVSpeechUtterance(string: text)
        utterance.voice = AVSpeechSynthesisVoice(language: "es-PE") ?? 
                          AVSpeechSynthesisVoice(language: "es-ES") ?? 
                          AVSpeechSynthesisVoice(language: "es-MX")
        utterance.rate = rate
        utterance.pitchMultiplier = pitch
        utterance.volume = 1.0
        
        synthesizer.speak(utterance)
    }
    
    public func stopSpeaking() {
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
        self.isSpeaking = false
    }
    
    // AVSpeechSynthesizerDelegate
    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        DispatchQueue.main.async {
            self.isSpeaking = false
            self.onFinishSpeaking?()
            self.onFinishSpeaking = nil
        }
    }
    
    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        DispatchQueue.main.async {
            self.isSpeaking = false
            self.onFinishSpeaking = nil
        }
    }
    
    // MARK: - Speech Recognition (Voice to Text)
    public func requestPermissions(completion: @escaping (Bool) -> Void) {
        #if os(iOS)
        SFSpeechRecognizer.requestAuthorization { authStatus in
            DispatchQueue.main.async {
                if authStatus == .authorized {
                    AVAudioApplication.requestRecordPermission { granted in
                        DispatchQueue.main.async {
                            self.permissionGranted = granted
                            completion(granted)
                        }
                    }
                } else {
                    self.permissionGranted = false
                    completion(false)
                }
            }
        }
        #else
        completion(true)
        #endif
    }
    
    public func startListening(onTranscript: @escaping (String) -> Void, onFinal: @escaping (String) -> Void) {
        #if os(iOS)
        stopSpeaking()
        stopListening()
        
        setupAudioSession()
        
        liveUserSpeech = ""
        isListening = true
        
        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
        guard let recognitionRequest = recognitionRequest else {
            isListening = false
            return
        }
        
        recognitionRequest.shouldReportPartialResults = true
        recognitionRequest.requiresOnDeviceRecognition = false
        
        let inputNode = audioEngine.inputNode
        
        recognitionTask = speechRecognizer?.recognitionTask(with: recognitionRequest) { [weak self] result, error in
            guard let self = self else { return }
            
            var isFinal = false
            if let result = result {
                let transcription = result.bestTranscription.formattedString
                self.liveUserSpeech = transcription
                onTranscript(transcription)
                isFinal = result.isFinal
                
                // Reset silence timer on new speech
                self.silenceTimer?.invalidate()
                self.silenceTimer = Timer.scheduledTimer(withTimeInterval: 1.8, repeats: false) { _ in
                    if !transcription.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                        self.stopListening()
                        onFinal(transcription)
                    }
                }
            }
            
            if error != nil || isFinal {
                self.stopListening()
                if let finalString = result?.bestTranscription.formattedString, !finalString.isEmpty {
                    onFinal(finalString)
                }
            }
        }
        
        let recordingFormat = inputNode.outputFormat(forBus: 0)
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in
            self.recognitionRequest?.append(buffer)
        }
        
        do {
            audioEngine.prepare()
            try audioEngine.start()
        } catch {
            print("Audio engine error: \(error)")
            stopListening()
        }
        #else
        self.isListening = true
        #endif
    }
    
    public func stopListening() {
        #if os(iOS)
        silenceTimer?.invalidate()
        silenceTimer = nil
        
        if audioEngine.isRunning {
            audioEngine.stop()
            audioEngine.inputNode.removeTap(onBus: 0)
        }
        
        recognitionRequest?.endAudio()
        recognitionRequest = nil
        recognitionTask?.cancel()
        recognitionTask = nil
        #endif
        
        DispatchQueue.main.async {
            self.isListening = false
        }
    }
    
    // MARK: - Agent AI Knowledge Base & Response Generation
    public func generateResponse(for agent: Agent, query: String) -> String {
        let q = query.lowercased()
        
        // 1. TRADIUM (Trading Quant Hyperliquid)
        if agent.id == "tradium-trading" {
            if q.contains("pnl") || q.contains("ganancia") || q.contains("balance") || q.contains("cartera") {
                return "Alexis, el balance de trading en Hyperliquid está en $102,450 USDC. Hoy tenemos un PnL positivo de +$3,420 (+3.45%), con 12 operaciones ganadoras consecutivas. Las posiciones en ETH-PERP y SOL están aseguradas en profit."
            }
            if q.contains("estrategia") || q.contains("arbitraje") || q.contains("reinversion") || q.contains("50%") {
                return "Nuestra regla maestra de gestión está blindada: el 50% de las utilidades se retira a USDC en bóveda segura y el otro 50% entra en auto-compounding algorítmico sobre ETH y BTC perp con apalancamiento máximo de 5x."
            }
            if q.contains("entrada") || q.contains("señal") || q.contains("comprar") || q.contains("btc") || q.contains("eth") {
                return "Detecto compresión de volatilidad alcista en ETH-PERP con funding rate favorable del 0.008%. El algoritmo de arbitraje estadístico tiene una orden límite escalonada en los $2,640."
            }
            return "Alexis, TRADIUM en línea. Monitorizando los libros de órdenes en Hyperliquid 24/7. El portafolio rinde +3.45% hoy. ¿Deseas ajustar el apalancamiento o revisar el take profit?"
        }
        
        // 2. VYRA (Marketing TikTok Ads)
        if agent.id == "vyra-growth" {
            if q.contains("escalar") || q.contains("10,000") || q.contains("soles") || q.contains("meta") {
                return "Para los S/. 10,000 diarios en Soles, activamos el escalamiento horizontal: 5 conjuntos de anuncios en TikTok Ads con CBO a S/. 200 cada uno, segmentando Lima Moderna y Provincias con el gancho de TurboJet."
            }
            if q.contains("gancho") || q.contains("hook") || q.contains("creativo") || q.contains("video") {
                return "Aquí tienes los 3 ganchos virales listos: 1. 'Si vives en Perú y aún limpias así, estás perdiendo el tiempo'. 2. 'El gadget de S/. 89 que agotó stock en Lima en 48 horas'. 3. 'Prueba pagar en la puerta de tu casa con envío gratis hoy'."
            }
            if q.contains("cpa") || q.contains("costo") || q.contains("roas") {
                return "El CPA actual en TikTok Ads está en S/. 14.80 por pedido confirmado, con un ROAS de 4.2x. Estamos muy por debajo de nuestro límite seguro de S/. 18 por venta."
            }
            return "Alexis, VYRA reportando. La campaña de TikTok Ads para el TurboJet está convirtiendo con fuerza en Lima. ¿Lanzamos el nuevo lote de creativos o subimos el presupuesto?"
        }
        
        // 3. MAX (Lead Engineer & Tech)
        if agent.id == "max-developer" {
            if q.contains("checkout") || q.contains("velocidad") || q.contains("tienda") || q.contains("app") {
                return "La tienda en Shopify y la app ejecutiva están respondiendo en menos de 0.8 segundos con Turbopack. El botón de Pedido Rápido 1-Click tiene una tasa de finalización del 88% en iPhone."
            }
            return "Sistemas al 100%, Alexis. Next.js 16 y los webhooks en tiempo real con Vercel y Dropi operan sin ninguna incidencia."
        }
        
        // 4. ECHO (Ventas & Dropi)
        if agent.id == "echo-sales" {
            if q.contains("pedidos") || q.contains("contra entrega") || q.contains("olva") || q.contains("shalom") {
                return "Llevamos 142 pedidos contra entrega confirmados hoy en Dropi Perú. 98 van para Lima Metropolitana vía Olva Courier y 44 para agencias Shalom en Arequipa y Trujillo."
            }
            return "Área de ventas lista, Alexis. Las confirmaciones por WhatsApp están cerrando al 84% de aceptación contra entrega."
        }
        
        // 5. SOL (WhatsApp & Atención)
        if agent.id == "sol-support" {
            return "Alexis, 28 clientes activos en WhatsApp. La IA responde en 1.2 segundos con los guiones de confirmación para evitar cancelaciones en puerta."
        }
        
        // 6. ATLAS (Operaciones & Stock)
        if agent.id == "atlas-ops" {
            return "Stock en almacén de Lima verificado: 850 unidades de TurboJet listas para empaquetado y rotulado con Dropi. 0 quiebres de inventario."
        }
        
        // 7. ALEX (Arquitectura Cloud)
        if agent.id == "alex-architect" {
            return "Toda la infraestructura cloud está sincronizada. Los webhooks de Shopify procesan cada orden y la envían a Dropi en 240 milisegundos."
        }
        
        // 8. NEX (Finanzas & Ganancia Neta)
        if agent.id == "nex-data" {
            return "Alexis, la ganancia neta proyectada para hoy es de S/. 3,450 Soles libres. El margen neto se ubica en 54.2% tras deducir costo de producto y flete contra entrega."
        }
        
        // Fallback genérico inteligente
        return "\(agent.name) a tus órdenes, Alexis. Directiva registrada. Procedo a ejecutarla de inmediato con la máxima prioridad para la empresa."
    }
}

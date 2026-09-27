'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOfficeStore } from '../../store/useOfficeStore';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  Brain,
  Globe2
} from 'lucide-react';
import { soundFX } from '../audio/soundEffects';

export const AgentChatModal: React.FC = () => {
  const isChatModalOpen = useOfficeStore((s) => s.isChatModalOpen);
  const selectedAgentId = useOfficeStore((s) => s.selectedAgentId);
  const agents = useOfficeStore((s) => s.agents);
  const chatMessages = useOfficeStore((s) => s.chatMessages);
  const soundEnabled = useOfficeStore((s) => s.soundEnabled);
  const languagePreference = useOfficeStore((s) => s.languagePreference);
  const setLanguagePreference = useOfficeStore((s) => s.setLanguagePreference);

  const setChatModalOpen = useOfficeStore((s) => s.setChatModalOpen);
  const sendChatMessage = useOfficeStore((s) => s.sendChatMessage);
  const startVoiceSession = useOfficeStore((s) => s.startVoiceSession);

  const [inputVal, setInputVal] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const agent = agents.find((a) => a.id === selectedAgentId);
  const messages = (agent && chatMessages[agent.id]) || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatModalOpen) {
      scrollToBottom();
    }
  }, [isChatModalOpen, messages]);

  // Clean up speech on close
  useEffect(() => {
    if (!isChatModalOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsSpeaking(false);
      setIsListening(false);
    }
  }, [isChatModalOpen]);

  if (!isChatModalOpen || !agent) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim() || isSending) return;

    setInputVal('');
    setIsSending(true);
    soundFX.playClick(soundEnabled);

    try {
      await sendChatMessage(agent.id, text);
      soundFX.playSuccess(soundEnabled);
    } finally {
      setIsSending(false);
    }
  };

  // Text to Speech playback
  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const isSpanish =
      languagePreference === 'es' ||
      (languagePreference === 'auto' && /[áéíóúñ¿¡]|(hola|ventas|producto)/i.test(text));
    utterance.lang = isSpanish ? 'es-ES' : 'en-US';
    utterance.rate = 1.05;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Voice input recognition
  const toggleListening = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: simulate voice transcription
      if (!isListening) {
        setIsListening(true);
        setInputVal('Analizando oportunidad de escala con TikTok Ads...');
        setTimeout(() => {
          setIsListening(false);
        }, 1800);
      } else {
        setIsListening(false);
      }
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = languagePreference === 'en' ? 'en-US' : 'es-PE';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        soundFX.playClick(soundEnabled);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Role-specific suggested prompt chips for Shopify, Scale & Strategy
  const suggestedPrompts: Record<string, string[]> = {
    'vyra-growth': [
      'Vyra, ¿cuál es el plan para escalar a S/. 10,000/día en Shopify?',
      'Genera 3 ganchos virales para TikTok Ads con el TurboJet.',
      '¿Cómo bajamos el costo de adquisición (CPA) a menos de S/. 15?'
    ],
    'alex-architect': [
      'Alex, ¿cómo sincronizamos Shopify con el ruteo automático de Dropi?',
      '¿Cómo garantizamos que el 95% de órdenes COD sean entregadas?',
      'Verifica la arquitectura de datos con Olva Courier y Shalom.'
    ],
    'nova-research': [
      'Nova, ¿cuáles son los 3 gadgets más rentables para vender en Perú hoy?',
      '¿Qué productos tienen alta demanda en TikTok Perú?',
      'Calcula el margen neto del TurboJet con costo de flete Dropi.'
    ],
    'max-developer': [
      'Max, ¿cómo optimizamos la tienda para convertir más visitas en compras?',
      'Verifica que el botón de Pedido Rápido 1-Click funcione sin errores.',
      'Optimiza la velocidad en celulares para reducir la tasa de rebote.'
    ],
    'luna-marketing': [
      'Luna, ¿cuál es la mejor estrategia de TikTok Ads para el TurboJet?',
      'Genera 3 ganchos de 3 segundos para Meta Reels y TikTok.',
      '¿Cómo logramos un ROAS de 4.5x con CPA menor a S/. 18?'
    ],
    'sofia-support': [
      'Sofia, ¿cómo evitamos que los pedidos contra entrega sean rechazados?',
      '¿Qué plantilla automática de WhatsApp enviamos al confirmar?',
      'Revisa los clientes pendientes de confirmación en Lima y provincias.'
    ],
    'nex-data': [
      'Nex, ¿cuál es nuestra facturación y ganancia neta en Soles?',
      '¿Cuál es el margen real descontando flete y costo de Dropi?',
      '¿Cuánto sube la ganancia con el upsell de S/. 25 en el checkout?'
    ],
    'eva-sales': [
      'Eva, ¿cómo aumentamos el ticket promedio de compra en la tienda?',
      '¿Qué combo promocional funciona mejor: 2x TurboJet o con Estuche?',
      'Cierra una venta especial con cliente indeciso por chat.'
    ],
    'atlas-ops': [
      'Atlas, ¿cómo van los tiempos de entrega con Olva y Shalom?',
      'Verifica el stock disponible en el almacén de Lima con Dropi.',
      '¿Se despacharon todos los pedidos confirmados de hoy?'
    ],
    'orion-security': [
      'Orion, ¿cómo evitamos pedidos falsos o bromas en contra entrega?',
      'Filtra números de teléfono sospechosos o con formato inválido.',
      'Protege la tienda contra spam y carritos bot.'
    ],
    'mia-creative': [
      'Mia, crea un video de impacto demostrando la potencia del TurboJet.',
      'Genera una imagen 3D de alta conversión para la portada de la tienda.',
      'Diseña un banner con oferta de envío gratis en 24h para Lima.'
    ]
  };

  const prompts = suggestedPrompts[agent.id] || [
    `¿En qué estás trabajando actualmente, ${agent.name}?`,
    `¿Cómo podemos optimizar tus tareas hoy?`,
    `Dame un resumen ejecutivo de tus métricas.`
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative flex h-[660px] w-full max-w-2xl flex-col rounded-2xl border border-sky-500/40 bg-[#080d1d] shadow-[0_0_60px_rgba(56,189,248,0.25)] overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#050713]/95 px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              style={{ borderColor: agent.color, backgroundColor: `${agent.color}15` }}
              className="relative flex h-12 w-12 items-center justify-center rounded-xl border-2 font-mono text-base font-black text-white shadow-md"
            >
              {agent.name.slice(0, 2)}
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-[#050713] shadow-[0_0_8px_#34d399]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-lg font-mono">{agent.name}</span>
                <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300 border border-sky-400/30">
                  {agent.role}
                </span>
                <span className="flex items-center gap-1 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="font-mono text-purple-300">{agent.model}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Brain className="h-3 w-3 text-sky-400" />
                  {agent.memoryCount} Memorias cargadas
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Switch to Realtime Live Voice */}
            <button
              onClick={() => {
                setChatModalOpen(false);
                startVoiceSession(agent.id);
                soundFX.playClick(soundEnabled);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-400/60 bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-blue-600/20 px-3 py-1 text-xs font-bold text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:brightness-125 transition group"
              title="Cambiar a conversación por voz en tiempo real"
            >
              <Mic className="h-3.5 w-3.5 text-cyan-400 animate-pulse group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">🎙 MODO VOZ EN VIVO</span>
              <span className="sm:hidden">VOZ</span>
            </button>

            {/* Language toggle for dialogue */}
            <button
              onClick={() => setLanguagePreference(languagePreference === 'es' ? 'en' : 'es')}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-xs font-bold text-slate-300 hover:text-white"
              title="Cambiar idioma de conversación"
            >
              <Globe2 className="h-3.5 w-3.5 text-sky-400" />
              <span>{languagePreference === 'es' ? '🇪🇸 ES' : languagePreference === 'en' ? '🇺🇸 EN' : 'AUTO'}</span>
            </button>

            <button
              onClick={() => {
                setChatModalOpen(false);
                soundFX.playClick(soundEnabled);
              }}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Message History Scroller */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-sky-500 to-indigo-600 text-white'
                    : 'bg-slate-800 text-sky-400 border border-slate-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[78%] rounded-2xl p-4 text-xs leading-relaxed shadow-lg relative group ${
                  msg.sender === 'user'
                    ? 'rounded-tr-none bg-sky-600 text-white font-medium'
                    : 'rounded-tl-none bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`mt-2 flex items-center justify-between text-[10px] font-mono ${
                    msg.sender === 'user' ? 'text-sky-200' : 'text-slate-500'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'agent' && (
                    <button
                      onClick={() => handleSpeak(msg.text)}
                      title="Escuchar respuesta con voz"
                      className="opacity-60 hover:opacity-100 transition text-sky-400 flex items-center gap-1"
                    >
                      <Volume2 className="h-3 w-3" />
                      <span>Audio</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Thinking Indicator */}
          {isSending && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-sky-400">
                <Bot className="h-4 w-4 animate-pulse" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-none border border-sky-500/30 bg-slate-900/90 px-4 py-3 text-xs text-sky-300">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span className="font-mono">{agent.name} está procesando tu solicitud...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="border-t border-slate-800/80 bg-[#050713]/60 px-6 py-2.5">
          <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-bold uppercase text-slate-400 font-mono">
            <Sparkles className="h-3 w-3 text-sky-400" />
            <span>Directivas Estratégicas Sugeridas:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {prompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                disabled={isSending}
                className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-medium text-sky-300 hover:bg-sky-500/20 whitespace-nowrap transition disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar with Voice (Talk) & Send */}
        <div className="border-t border-slate-800 bg-[#050713] p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Talk (Voice Dictation) Button */}
            <button
              type="button"
              onClick={toggleListening}
              title={isListening ? 'Detener micrófono' : 'Hablar con el agente (Voz a texto)'}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition active:scale-95 ${
                isListening
                  ? 'border-red-500 bg-red-500/20 text-red-400 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:border-sky-500/50'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={isListening ? 'Escuchando tu voz...' : `Mensaje para ${agent.name} (${agent.role})...`}
              disabled={isSending}
              className={`flex-1 rounded-xl border bg-slate-900 px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition ${
                isListening
                  ? 'border-red-400 ring-1 ring-red-400'
                  : 'border-slate-700 focus:border-sky-400 focus:ring-1 focus:ring-sky-400'
              }`}
            />

            <button
              type="submit"
              disabled={!inputVal.trim() || isSending}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:brightness-110 disabled:opacity-40 transition active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

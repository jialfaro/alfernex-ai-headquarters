import SwiftUI

public struct AgentRosterView: View {
    @ObservedObject var vm: HQViewModel
    @State private var searchText: String = ""
    @State private var selectedDepartment: String = "TODOS"
    
    let departments = [
        "TODOS",
        "Trading & Finanzas",
        "Marketing",
        "Tecnología",
        "Infraestructura",
        "Investigación",
        "Atención al Cliente",
        "Finanzas",
        "Ventas",
        "Operaciones",
        "Seguridad",
        "Creativo"
    ]
    
    var filteredAgents: [Agent] {
        vm.agents.filter { agent in
            let matchesSearch = searchText.isEmpty ||
                agent.name.localizedCaseInsensitiveContains(searchText) ||
                agent.role.localizedCaseInsensitiveContains(searchText)
            let matchesDept = selectedDepartment == "TODOS" || agent.department == selectedDepartment
            return matchesSearch && matchesDept
        }
    }
    
    public var body: some View {
        VStack(spacing: 12) {
            // Search Bar
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.gray)
                TextField("Buscar agente...", text: $searchText)
                    .font(.system(size: 13, design: .monospaced))
                    .foregroundColor(.white)
            }
            .padding(10)
            .background(Color.white.opacity(0.06))
            .cornerRadius(12)
            .padding(.horizontal)
            
            // Department Filter Chips
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(departments, id: \.self) { dept in
                        Button {
                            selectedDepartment = dept
                        } label: {
                            Text(dept)
                                .font(.system(size: 10, weight: .bold, design: .monospaced))
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(selectedDepartment == dept ? Color.cyan.opacity(0.2) : Color.white.opacity(0.04))
                                .foregroundColor(selectedDepartment == dept ? .cyan : .gray)
                                .cornerRadius(20)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 20)
                                        .stroke(selectedDepartment == dept ? Color.cyan.opacity(0.4) : Color.clear, lineWidth: 1)
                                )
                        }
                    }
                }
                .padding(.horizontal)
            }
            
            // Agent Cards List
            ScrollView(showsIndicators: false) {
                LazyVStack(spacing: 12) {
                    ForEach(filteredAgents) { agent in
                        VStack(alignment: .leading, spacing: 10) {
                            HStack(alignment: .top, spacing: 12) {
                                // Avatar circle
                                Circle()
                                    .fill(agent.color)
                                    .frame(width: 44, height: 44)
                                    .overlay(
                                        Text(String(agent.name.prefix(2)))
                                            .font(.system(size: 15, weight: .black, design: .monospaced))
                                            .foregroundColor(.white)
                                    )
                                    .shadow(color: agent.color.opacity(0.4), radius: 6)
                                
                                VStack(alignment: .leading, spacing: 3) {
                                    HStack(spacing: 6) {
                                        Text(agent.name)
                                            .font(.system(size: 15, weight: .black, design: .monospaced))
                                            .foregroundColor(.white)
                                        
                                        if agent.isSpecial {
                                            Text("NUEVO • QUANT")
                                                .font(.system(size: 8, weight: .black, design: .monospaced))
                                                .padding(.horizontal, 4)
                                                .padding(.vertical, 2)
                                                .background(Color.green.opacity(0.2))
                                                .foregroundColor(.green)
                                                .cornerRadius(4)
                                        }
                                        
                                        Spacer()
                                        
                                        Text(agent.status.rawValue)
                                            .font(.system(size: 8.5, weight: .bold, design: .monospaced))
                                            .padding(.horizontal, 6)
                                            .padding(.vertical, 3)
                                            .background(agent.status.color.opacity(0.15))
                                            .foregroundColor(agent.status.color)
                                            .cornerRadius(6)
                                    }
                                    
                                    Text(agent.role)
                                        .font(.system(size: 11.5, weight: .medium))
                                        .foregroundColor(.white.opacity(0.8))
                                    
                                    HStack(spacing: 6) {
                                        Text("\(agent.department) • \(agent.clearance)")
                                            .font(.system(size: 9.5, design: .monospaced))
                                            .foregroundColor(.gray)
                                        
                                        Spacer()
                                        
                                        Text(agent.aiModel.uppercased())
                                            .font(.system(size: 8, weight: .black, design: .monospaced))
                                            .padding(.horizontal, 5)
                                            .padding(.vertical, 2)
                                            .background(Color.blue.opacity(0.2))
                                            .foregroundColor(.cyan)
                                            .cornerRadius(4)
                                    }
                                }
                            }
                            
                            // Speech bubble / Current action
                            Text("\"\(agent.speechBubble)\"")
                                .font(.system(size: 11, design: .monospaced))
                                .foregroundColor(.white.opacity(0.85))
                                .padding(10)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color.white.opacity(0.04))
                                .cornerRadius(10)
                            
                            // Sim Meters
                            HStack(spacing: 12) {
                                HStack(spacing: 4) {
                                    Image(systemName: "battery.100.bolt").foregroundColor(.green).font(.system(size: 10))
                                    Text("ENERGÍA \(agent.simStats.energy)%")
                                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                                        .foregroundColor(.green)
                                }
                                
                                HStack(spacing: 4) {
                                    Image(systemName: "brain.head.profile").foregroundColor(.cyan).font(.system(size: 10))
                                    Text("ENFOQUE \(agent.simStats.focus)%")
                                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                                        .foregroundColor(.cyan)
                                }
                                
                                Spacer()
                                
                                Text(agent.simStats.mood)
                                    .font(.system(size: 9, design: .monospaced))
                                    .foregroundColor(.purple)
                            }
                            
                            // Action Buttons (1-Tap Voice & Chat)
                            HStack(spacing: 8) {
                                Button {
                                    vm.startVoice(with: agent)
                                } label: {
                                    HStack {
                                        Image(systemName: "mic.fill")
                                        Text("HABLAR (VOZ)")
                                    }
                                    .font(.system(size: 11.5, weight: .black, design: .monospaced))
                                    .foregroundColor(.black)
                                    .frame(maxWidth: .infinity)
                                    .padding(.vertical, 10)
                                    .background(
                                        LinearGradient(colors: [Color.cyan, Color.blue], startPoint: .leading, endPoint: .trailing)
                                    )
                                    .cornerRadius(12)
                                }
                                
                                Button {
                                    vm.openChat(with: agent)
                                } label: {
                                    HStack {
                                        Image(systemName: "message.fill")
                                        Text("CHAT")
                                    }
                                    .font(.system(size: 11, weight: .bold, design: .monospaced))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 10)
                                    .background(Color.white.opacity(0.08))
                                    .cornerRadius(12)
                                }
                            }
                        }
                        .padding(14)
                        .background(Color(hex: "#050816").opacity(0.9))
                        .cornerRadius(20)
                        .overlay(
                            RoundedRectangle(cornerRadius: 20)
                                .stroke(agent.isSpecial ? Color.green.opacity(0.4) : Color.white.opacity(0.08), lineWidth: 1)
                        )
                    }
                }
                .padding(.horizontal)
                .padding(.bottom, 60)
            }
        }
    }
}

# Sítio Chat App - TODO

## Fase 1: Setup e Branding
- [x] Gerar logo/ícone do app
- [x] Atualizar app.config.ts com branding
- [x] Configurar paleta de cores (verde temático)

## Fase 2: Tela de Seleção de Personagens
- [x] Criar componente CharacterCard
- [x] Implementar grid de personagens (2 colunas)
- [x] Adicionar imagens/avatares dos personagens
- [x] Implementar navegação para tela de chat
- [x] Estilizar com tema verde

## Fase 3: Tela de Chat
- [x] Criar componente ChatScreen
- [x] Implementar histórico de mensagens (ScrollView)
- [x] Criar componentes de bolha de mensagem (usuário e bot)
- [x] Implementar input bar com envio de mensagens
- [x] Adicionar indicador de digitação
- [x] Integrar com API de IA para respostas dos personagens

## Fase 4: Integração com IA
- [x] Configurar chamadas para servidor backend (LLM)
- [x] Implementar prompts específicos para cada personagem
- [x] Testar respostas contextualizadas
- [x] Adicionar tratamento de erros

## Fase 5: Persistência de Dados
- [x] Implementar AsyncStorage para histórico de chats
- [x] Carregar histórico ao retornar ao personagem
- [x] Implementar função de limpar histórico

## Fase 6: Personagens Completos
- [x] Emília (boneca falante, atrevida)
- [x] Visconde de Sabugosa (sábio, medroso)
- [x] Narizinho (menina aventureira)
- [x] Pedrinho (primo corajoso)
- [x] Dona Benta (avó sábia)
- [x] Tia Nastácia (cozinheira)
- [x] Saci-Pererê (criatura travessa)
- [x] Cuca (bruxa jacaré)
- [x] Rabicó (porco guloso)
- [x] Tio Barnabé (velho sábio)
- [x] Conselheiro (burro educado)
- [x] Quindim (rinoceronte gentil)

## Fase 7: Polish e Testes
- [ ] Testar fluxos de navegação
- [ ] Validar responsividade em diferentes tamanhos
- [ ] Testar em Android via Expo Go
- [ ] Otimizar performance
- [ ] Revisar acessibilidade

## Fase 8: Build e Deploy
- [ ] Criar checkpoint final
- [ ] Gerar APK para Android
- [ ] Testar APK em dispositivo real


## Fase 8: Funcionalidade de Voz
- [x] Implementar gravação de mensagens de voz
- [x] Criar componentes de UI para controle de voz
- [x] Adicionar text-to-speech para respostas dos personagens
- [ ] Integrar transcrição de áudio para texto (próxima etapa)
- [ ] Testar gravação e reprodução de áudio


## Fase 9: Vozes Personalizadas por Personagem
- [ ] Ajustar voz da Emília para ser fininha (pitch alto)
- [ ] Configurar vozes específicas para cada personagem
- [ ] Testar e validar vozes


## Fase 10: Chamadas de Voz em Tempo Real
- [x] Criar tela de chamada de voz
- [x] Implementar gravação contínua de áudio
- [x] Criar interface de chamada com botões (iniciar/encerrar)
- [x] Adicionar botão de chamada na tela de chat
- [ ] Integrar transcrição de voz para texto (speech-to-text)
- [ ] Adicionar resposta automática em áudio
- [ ] Testar chamadas de voz


## Fase 11: Correções e Melhorias
- [x] Corrigir scroll e navegação entre personagens (mostrar todos os 12)
- [x] Verificar prompts de cada personagem para respostas contextualizadas
- [x] Adicionar foto de perfil no topo do chat
- [x] Testar navegação completa


## Fase 12: Grupos de Personagens
- [x] Criar interface de seleção de personagens para grupos (até 5)
- [x] Implementar tela de criação de grupos
- [x] Criar chat em grupo com múltiplos personagens
- [x] Adicionar lógica de turnos e interações entre personagens
- [x] Implementar conversas fluidas sem todos falarem ao mesmo tempo
- [x] Adicionar identificação de quem está falando em cada mensagem
- [x] Testar interações entre personagens em grupo


## Fase 13: Personagens Customizados
- [x] Criar interface para adicionar novo personagem
- [x] Implementar upload de foto do personagem
- [x] Adicionar campos de nome e características
- [x] Salvar personagens customizados em AsyncStorage
- [x] Integrar personagens customizados no chat
- [ ] Permitir usar personagens customizados em grupos
- [ ] Testar criação e uso de personagens customizados


## Fase 14: Turma do Pererê e Sistema de Abas
- [x] Adicionar personagens da Turma do Pererê (Saci, Cuca, Lobisomem, Iara, Curupira, Boitatá, Mula Sem Cabeça, Negrinho do Pastoreio)
- [x] Implementar sistema de abas para organizar por turma
- [x] Remover opção de criar novo personagem
- [x] Testar navegação entre abas
- [x] Gerar imagens para todos os personagens da Turma do Pererê
- [x] Atualizar mapeamento de imagens no arquivo character-images.ts


## Fase 15: Transcrição de Áudio para Mensagens
- [x] Implementar gravação de áudio com expo-audio
- [x] Integrar transcrição de áudio para texto (speech-to-text)
- [x] Adicionar botão de microfone na barra de input
- [x] Criar rota tRPC para transcrição usando Whisper API
- [x] Integrar componente AudioInput com transcrição real
- [ ] Testar gravação e transcrição em Android

## Fase 16: Sítio 2 - Novos Personagens
- [x] Gerar imagens para Coronel Teodorico
- [x] Gerar imagens para Príncipe Escamado
- [x] Gerar imagens para Doutor Caramujo
- [x] Gerar imagens para Pequeno Polegar
- [x] Gerar imagens para Zé Carneiro
- [x] Gerar imagens para Garnizé
- [x] Gerar imagens para Pesadelo
- [x] Gerar imagens para Capitão Gancho
- [x] Gerar imagens para Major Agarra-e-não-larga-mais
- [x] Adicionar 10 personagens ao constants/characters.ts
- [x] Criar aba "🌾 Sítio 2" na tela inicial
- [x] Implementar navegação entre três abas (Sítio, Pererê, Sítio 2)
- [ ] Testar chat com novos personagens


## Fase 17: Aba Personalizados com Saci Grilo
- [x] Adicionar Saci Grilo como personagem customizado
- [x] Fazer upload da imagem do Saci Grilo
- [x] Criar aba "Personalizados" na tela inicial
- [x] Integrar navegação entre 4 abas (Sítio, Pererê, Sítio 2, Personalizados)
- [ ] Testar chat com Saci Grilo


## Fase 18: Adicionar 12 Personagens do Arraial dos Tucanos
- [x] Gerar imagens para 12 personagens do Arraial dos Tucanos
- [x] Adicionar 12 personagens ao arquivo characters.ts
- [x] Mapear imagens dos personagens no character-images.ts
- [x] Integrar novos personagens à aba Personalizados
- [ ] Testar chat com personagens do Arraial


## Fase 19: Aba Praça - 12 Humoristas de A Praça é Nossa
- [ ] Gerar imagens para 12 humoristas de A Praça é Nossa
- [ ] Adicionar 12 humoristas ao arquivo characters.ts
- [ ] Mapear imagens dos humoristas no character-images.ts
- [ ] Criar aba "🎪 Praça" na tela inicial
- [ ] Integrar navegação entre 5 abas (Sítio, Pererê, Sítio 2, Personalizados, Praça)
- [ ] Testar chat com humoristas

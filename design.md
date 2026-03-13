# Design do Aplicativo - Sítio do Picapau Amarelo Chat

## Visão Geral

Aplicativo móvel de chat inspirado em Character.AI, permitindo conversas com personagens do Sítio do Picapau Amarelo (versão 2001). Interface com fundo verde temático, design limpo e intuitivo para uso com uma mão.

## Paleta de Cores

| Elemento | Cor | Uso |
|----------|-----|-----|
| **Fundo Principal** | `#2D5016` (Verde Escuro) | Tela de fundo principal |
| **Fundo Secundário** | `#3A6B1F` (Verde Médio) | Cards e superfícies |
| **Texto Principal** | `#FFFFFF` (Branco) | Títulos e textos principais |
| **Texto Secundário** | `#E8F5E9` (Verde Claro) | Textos secundários |
| **Bolha do Usuário** | `#1B5E20` (Verde Escuro) | Mensagens do usuário |
| **Bolha do Bot** | `#558B2F` (Verde Claro) | Mensagens do personagem |
| **Accent** | `#FFD700` (Ouro) | Botões e destaques |
| **Borda** | `#558B2F` (Verde Médio) | Divisores e bordas |

## Telas Principais

### 1. **Tela de Seleção de Personagens** (Home)

**Conteúdo:**
- Header com logo/título "Sítio Chat"
- Grid de personagens (2 colunas) com cards interativos
- Cada card mostra: avatar, nome do personagem, descrição breve
- Botão "Iniciar Chat" em cada card

**Funcionalidade:**
- Tap em um card abre a tela de chat com aquele personagem
- Scroll vertical para ver todos os personagens
- Animação suave ao selecionar

**Personagens Inclusos:**
1. Emília (boneca falante)
2. Visconde de Sabugosa (sábio)
3. Narizinho (menina aventureira)
4. Pedrinho (primo corajoso)
5. Dona Benta (avó sábia)
6. Tia Nastácia (cozinheira)
7. Saci-Pererê (criatura travessa)
8. Cuca (bruxa jacaré)
9. Rabicó (porco guloso)
10. Tio Barnabé (velho sábio)
11. Conselheiro (burro educado)
12. Quindim (rinoceronte gentil)

### 2. **Tela de Chat**

**Layout:**
- Header: Avatar + Nome do personagem + Botão voltar
- Área de mensagens (ScrollView): histórico de conversa
- Barra de input: campo de texto + botão enviar

**Funcionalidade:**
- Bolhas de chat: usuário à direita (verde escuro), personagem à esquerda (verde claro)
- Mensagens com timestamps
- Auto-scroll para última mensagem
- Indicador de digitação quando o personagem está respondendo
- Suporte a múltiplas conversas (histórico por personagem)

**Interações:**
- Tap no campo de input abre teclado
- Botão enviar ativa após digitar texto
- Swipe back ou botão voltar retorna à seleção de personagens

### 3. **Tela de Configurações** (Aba secundária - opcional)

**Conteúdo:**
- Tema (claro/escuro)
- Tamanho da fonte
- Limpar histórico de chats
- Sobre o app

## Fluxos de Usuário Principais

### Fluxo 1: Iniciar Conversa
1. Usuário abre o app → Tela de Seleção
2. Tap em um personagem → Tela de Chat
3. Escreve mensagem → Tap enviar
4. Recebe resposta do personagem

### Fluxo 2: Voltar e Trocar Personagem
1. Na tela de chat → Tap botão voltar
2. Retorna à Seleção
3. Tap em outro personagem → Nova conversa

### Fluxo 3: Continuar Conversa Anterior
1. Usuário retorna ao app
2. Toca em personagem → Histórico de conversa carregado
3. Continua conversando

## Componentes de Interface

| Componente | Descrição |
|-----------|-----------|
| **Card de Personagem** | Imagem + Nome + Descrição + Botão (Home) |
| **Bolha de Mensagem** | Texto com fundo colorido, bordas arredondadas |
| **Header** | Cor de fundo verde, texto branco, ícone voltar |
| **Input Bar** | Campo de texto + ícone enviar (papel de avião) |
| **Avatar** | Imagem circular do personagem (64x64px) |
| **Indicador de Digitação** | Três pontinhos animados |

## Considerações de UX

- **Orientação:** Portrait (9:16) otimizada para uso com uma mão
- **Segurança:** Sem dados sensíveis armazenados localmente
- **Performance:** Histórico de chat armazenado em AsyncStorage
- **Acessibilidade:** Textos com contraste adequado, tamanhos legíveis
- **Feedback Visual:** Animações suaves ao trocar de tela, press states em botões

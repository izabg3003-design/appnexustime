export const nexusCurrencies = [
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$' }
];

export const translations: Record<string, any> = {
  'pt-PT': {
    common: {
      login: "Acesso Membro",
      activate: "Ativar Licença",
      back: "Voltar",
      save: "Guardar",
      loading: "A processar...",
      today: "Hoje",
      syncing: "A sincronizar..."
    },
    splash: {
      tagline: "Controlo de horas e gestão de IRS num só lugar"
    },
    landing: {
      hero: "TRANSFORME HORAS EM",
      heroHighlight: "LUCRO REAL.",
      subhero: "O NexusTime é o app de controlo de horas ideal para registar horas extra e gerir o seu horário de trabalho em Portugal com precisão absoluta.",
      badge: "Digital Nexus Solutions • 2026",
      painTitle: "Problemas no Registo",
      solutionTitle: "Solução Digital Nexus",
      pains: [
        "Não me pagaram horas extra por falta de registo.",
        "Caos na gestão de horas trabalhadas mensalmente.",
        "Erro no cálculo de IRS e Segurança Social."
      ],
      solutions: [
        "Registo de horas de trabalho atómico.",
        "Relatório de horas para o IRS automático.",
        "Controlo de pagamentos e vales integrado."
      ],
      advantages: [
        { title: "Gestão de Horários", desc: "Registo rigoroso de entradas e saídas alinhado com a lei portuguesa." },
        { title: "Controlo de Horas Extra", desc: "Prove cada minuto trabalhado e garanta o seu pagamento correto." },
        { title: "Cálculo de IRS Portugal", desc: "Cálculo instantâneo de retenções para recibos verdes e contratos." },
        { title: "Sincronização Cloud", desc: "Substitua a folha de horas manual por segurança digital total." },
        { title: "Suporte Nexus Elite", desc: "Ajudamos com dúvidas sobre faturação e horas trabalhadas." },
        { title: "Trabalho por Turnos", desc: "Otimizado para quem trabalha com horários rotativos ou flexíveis." }
      ],
      promo: {
        badge: "Oferta de Lançamento",
        title: "Vantagens",
        highlight: "Exclusivas Elite:",
        period: "/Ano",
        sub: "Pague Uma Vez, Use o Ano Todo",
        cta: "Ativar Licença Agora",
        advantages: [
          "App Registo de Horas Atómico",
          "Cálculo de Horas Trabalhadas",
          "Relatórios PDF para Contabilista",
          "Suporte para Recibos Verdes"
        ]
      },
      support: {
        title: "Suporte Especializado",
        desc: "Dúvidas sobre como calcular horas extra ou organizar pagamentos? Estamos aqui."
      },
      final: {
        title: "PARE DE PERDER",
        highlight: "HORAS EXTRAS.",
        cta: "Ativar Nexus Pro"
      },
      footer: {
        note: "Digital Nexus. Gestão de Horas de Trabalho de Elite.",
        privacy: "Privacidade",
        terms: "Termos"
      }
    },
    login: {
      secureAccess: "ACESSO SEGURO",
      idNexus: "ID Nexus / Email",
      securityKey: "Palavra-passe",
      validateAccess: "Entrar no App",
      platformNote: "Plataforma Digital Nexus Solutions",
      blockedTitle: "ACESSO BLOQUEADO",
      blockedMsg: "Por favor, confirme o seu e-mail ou contacte o administrador.",
      invalidTitle: "CREDENCIAIS INVÁLIDAS",
      invalidMsg: "O e-mail ou palavra-passe não coincidem.",
      systemError: "ERRO DE SISTEMA"
    },
    dashboard: {
      activeOp: "Registo Ativo",
      shift: "Turno Nexus",
      entry: "Entrada",
      exit: "Saída",
      location: "Local / Serviço",
      locationPlaceholder: "Local...",
      advance: "Adiantamento",
      extra: "Horas Extra",
      notes: "Observações",
      absence: "falta",
      lunch: "almoço",
      sync: "registar",
      update: "registar"
    },
    settings: {
      title: "O Meu Perfil",
      idAndContact: "DADOS PESSOAIS",
      displayName: "Nome Completo",
      taxId: "NIF / ID Fiscal",
      phone: "Telemóvel",
      standardHours: "HORÁRIO BASE",
      defaultEntry: "Entrada Padrão",
      defaultExit: "Saída Padrão",
      hourlyRate: "Valor à Hora (€)",
      saveBtn: "Guardar",
      saving: "A guardar...",
      saved: "Guardado",
      security: {
        title: "Segurança",
        newPassword: "Nova Senha",
        confirmPassword: "Confirmar"
      }
    }
  }
};
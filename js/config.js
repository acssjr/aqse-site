/**
 * Configuração central dos CTAs.
 * Troque o número provisório e as mensagens aqui — todos os botões com [data-wa] leem daqui.
 */
window.AQSE_CONFIG = {
  whatsappNumber: "5575981234176", // provisório: (75) 98123-4176
  messages: {
    header:
      "Oi! Conheci o Antes que se esqueça pelo site e quero saber como funciona um presente com memórias.",
    hero:
      "Oi! Quero presentear alguém com uma memória. Posso contar a nossa história?",
    inside:
      "Oi! Vi as formas de presentear e quero entender as possibilidades de cartas, fotos, miniaturas, caixas e estojos.",
    process:
      "Oi! Entendi como funciona e queria começar: quero reunir algumas lembranças em um presente.",
    occasion:
      "Oi! Estou pensando num presente especial e queria ajuda pra escolher o que incluir no presente.",
    faq:
      "Oi! Li as perguntas frequentes, mas fiquei com uma dúvida sobre o presente com memórias.",
    sticky:
      "Oi! Estou vendo o site agora e quero pedir um orçamento pra um presente com memórias.",
    final:
      "Oi! Decidi: quero transformar uma lembrança em presente. Como a gente começa?",
  },
};

window.AQSE_whatsappHref = function (intent) {
  var cfg = window.AQSE_CONFIG;
  var msg = cfg.messages[intent] || cfg.messages.header;
  return "https://wa.me/" + cfg.whatsappNumber + "?text=" + encodeURIComponent(msg);
};

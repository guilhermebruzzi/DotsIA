describe("Agente funcionando", function() {
	  beforeEach(function() {
        _linhas = 3;
        _colunas = 4;
        _marcadas = []
        _quadradosJogador = []
        _quadradosComputador = []
		_tabuleiro = new Tabuleiro(_linhas, _colunas, _marcadas, _quadradosJogador, _quadradosComputador);
		_agente = new Agente();
	  });

	it("naoRepete", function() {
	    
	});
	
});

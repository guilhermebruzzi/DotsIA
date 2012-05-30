describe("Tabuleiro funcionando", function() {
	  beforeEach(function() {
        _linhas = 3;
        _colunas = 4;
        _marcadas = []
        _quadradosJogador = []
        _quadradosComputador = []
		_tabuleiro = new Tabuleiro(_linhas, _colunas, _marcadas, _quadradosJogador, _quadradosComputador);
	  });

    function _toContainArestas(_arestas_tabuleiro, _suas_arestas){
        for(var i in _suas_arestas){
            expect(_arestas_tabuleiro).toContain(_suas_arestas[i]);
        }
    }

	it("getQuadradoArestas", function() {
		var _arestas = _tabuleiro.getQuadradoArestas(1,0);
		_toContainArestas(_arestas, [1, 4, 5, 8]);
		
		_arestas = _tabuleiro.getQuadradoArestas(2,1);
		_toContainArestas(_arestas, [9, 12, 13, 16]);
	});
	
	
	it("getArestaQuadrados", function() {
		var _quadrados = _tabuleiro.getArestaQuadrados(0);
		expect(_quadrados).toContain([0, 0]);
		
		_quadrados = _tabuleiro.getArestaQuadrados(8);
		expect(_quadrados).toContain([1, 1]);
		expect(_quadrados).toContain([1, 0]);

		_quadrados = _tabuleiro.getArestaQuadrados(13);
		expect(_quadrados).toContain([2, 1]);
	});
	
	function tabuleirosIguais(tab1, tab2){
        expect(tab1.linhas).toEqual(tab2.linhas);
        expect(tab1.colunas).toEqual(tab2.colunas);
	    expect(tab1.linhasQuadrados).toEqual(tab2.linhasQuadrados);
	    expect(tab1.colunasQuadrados).toEqual(tab2.colunasQuadrados);
	    expect(tab1.marcadas).toEqual(tab2.marcadas);
	    expect(tab1.quadradosJogador).toEqual(tab2.quadradosJogador);
	    expect(tab1.quadradosComputador).toEqual(tab2.quadradosComputador);
        expect(tab1.mapa_arestas_quadrados).toEqual(tab2.mapa_arestas_quadrados);
	}
	
	it("clone", function(){
	    _tabuleiro_clone = _tabuleiro.clone();
	    tabuleirosIguais(_tabuleiro_clone, _tabuleiro);
	    for(var i = 0; i < 100; i++){ // Verifica se ao se clonar muito, nada muda
	        _tabuleiro_clone = _tabuleiro_clone.clone();
    	    tabuleirosIguais(_tabuleiro_clone, _tabuleiro);
	    }
	});
	
});

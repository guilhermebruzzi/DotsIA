describe("HTML na tela", function() {
	  beforeEach(function() {
        _linhas = 5;
        _colunas = 7;
        _dots = new Dots(_linhas, _colunas);
        _html = _dots.getHtmlMalha();
	  });

	it("Não está vazio", function() {
		expect(_html).not.toEqual("");
	});

	it("Testa cabecalho da malha", function() {
		var texto = _linhas + " x " + _colunas;
		var placar = _dots.tabuleiro.quadradosComputador.length  + " x " + _dots.tabuleiro.quadradosJogador.length;
		expect(_html).toContain(texto);
		expect(_html).toContain(placar);
	});

	it("Atualiza linhas e colunas", function() {
		_dots.atualizaMalha();
		var texto = _linhas + " x " + _colunas;
		var _html_colocado = $("#malha").html();
		expect( _html_colocado).toContain(texto);
	});

	it("Gera Malha", function() {
		_dots.atualizaMalha();
		var texto = _linhas + " x " + _colunas;
		var _html_colocado = $("#malha").html();
		expect( _html_colocado).not.toContain('data-indice="undefined"');
		expect( _html_colocado).toContain('data-indice="1"');
	});

});



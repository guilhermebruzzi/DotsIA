describe("HTML na tela", function() {
	  beforeEach(function() {
		_dots = new Dots();
		_linhas = 5;
		_colunas = 7;
		_html = _dots.retornaHTMLMalha(5, 7);
	  });

	it("Não está vazio", function() {
		expect(_html).not.toEqual("");
	});

	it("Contém linhas e colunas", function() {
		var texto = _linhas + " x " + _colunas;
		expect(_html).toContain(texto);
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



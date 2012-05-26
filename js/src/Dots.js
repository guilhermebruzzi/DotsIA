function Dots(_linhas, _colunas){
	this.agente = new Agente();
	this.numeroLinhas = _linhas;
	this.numeroColunas = _colunas;
	this.jogadas_pessoa = [];
	this.jogadas_computador = [];
	this.tabuleiro = [];
	for (var i=0;i<$("#numeroLinhas").val()-1;i++){
		for (var j=0;j<$("#numeroColunas").val()-1;j++){
			if (j==0){
				this.tabuleiro.push(Array('0000'));
			}
			else{
				this.tabuleiro[i].push('0000');
			}
		}
	}
}

Dots.prototype.getElemento = function(classe, indice){
	var template = '<div class="%class%" data-indice="%indice%"></div>';
	return template.replace("%class%", classe).replace("%indice%", indice); 
}

Dots.prototype.getLinhaHorizontal = function(indice, marcado){
	marcado_classe = (marcado === true) ? "marcado" : "";
	return this.getElemento("linha-horizontal " + marcado_classe, indice);
}

Dots.prototype.getLinhaVertical = function(first, indice, marcado){
	marcado_classe = (marcado === true) ? "marcado" : "";
	if(first){
		return this.getElemento("linha-vertical linha-vertical-first " + marcado_classe, indice);
	}
	return this.getElemento("linha-vertical " + marcado_classe, indice);
}

Dots.prototype.getVertice = function(first){
	if(first){
		return this.getElemento("vertice vertice-first", 0);
	}
	return this.getElemento("vertice", 0);
}

Dots.prototype._inMarcadas = function(elem, marcadas){
	elem = parseInt(elem, 10);
	for(e in marcadas){
		e = parseInt(marcadas[e], 10);
		if(e === elem){
			return true;
		}
	}
	return false;
}

Dots.prototype.getMalha = function(marcadas){
	var html = "";
	var linha = 1;
	for(var i = 0; i< this.linhas; i++){
		if(i > 0){
			for(var j = 0; j < this.colunas; j++){
				html += this.getLinhaVertical(j==0, linha, this._inMarcadas(linha, marcadas));
				linha++;
			}		
		}
		for(var j = 0; j < this.colunas; j++){
			if(j == 0){
				html += this.getVertice(true);
			}
			else{
				html += this.getLinhaHorizontal(linha, this._inMarcadas(linha, marcadas));
				linha++;
				html += this.getVertice(false);
			}
		}
	}
	return html;
}

Dots.prototype.getMarcadas = function(){
	var _jogadas_computador = this.jogadas_computador;
	var _jogadas_pessoa = this.jogadas_pessoa;
	var marcadas = [];
	if(_jogadas_computador!=""){
		for(temp in _jogadas_computador){
			temp = parseInt(_jogadas_computador[temp], 10);
			marcadas.push(temp);
		}
	}
	if(_jogadas_pessoa!=""){
		for(temp in _jogadas_pessoa){
			temp = parseInt(_jogadas_pessoa[temp], 10);
			marcadas.push(temp);
		}
	}
	return marcadas;
}

Dots.prototype.retornaHTMLMalha = function(_linhas, _colunas){
	this.linhas = _linhas;
	this.colunas = _colunas;

	var marcadas = this.getMarcadas();

	return "Malha " + this.linhas + " x " + this.colunas + " <br /> " + this.getMalha(marcadas);
}

Dots.prototype.atualizaMalha = function(){
	$("#malha").html(this.retornaHTMLMalha(dots.numeroLinhas, dots.numeroColunas));
}

Dots.prototype.jogadorJoga = function(_jogada_pessoa){
	dots.jogadas_pessoa.push(_jogada_pessoa);
	var orientacao = dots.orientacao(_jogada_pessoa);
	var linhas = dots.yQuadrado(_jogada_pessoa, orientacao);
	var colunas = dots.xQuadrado(_jogada_pessoa, orientacao);
	dots.atualizaMalha();
}

Dots.prototype.agenteJoga = function(){
	var jogada_computador = dots.agente.jogadaComputador( new Malha(dots.numeroLinhas, dots.numeroColunas, dots.jogadas_computador, dots.jogadas_pessoa) );
	dots.jogadas_computador.push(jogada_computador);
	var orientacao = dots.orientacao(jogada_computador);
	var linhas = dots.yQuadrado(jogada_computador, orientacao);
	var colunas = dots.xQuadrado(jogada_computador, orientacao);
	dots.atualizaMalha();
}

// retorna a(s) coordenada(s) x do(s) quadrado(s)
Dots.prototype.xQuadrado = function(_jogada, _orientacao){
	var colunas = Array();
	if (_orientacao == 0){
		var coluna = (_jogada-1)%(2*dots.numeroColunas-1);
		colunas.push(coluna);
	}
	if (_orientacao == 1){
		var colunaEsq = ((_jogada-1)%(2*dots.numeroColunas-1))-dots.numeroColunas;
		var colunaDir = colunaEsq+1;
		if (colunaEsq >= 0){
			colunas.push(colunaEsq);
		}
		if (colunaDir < dots.numeroColunas-1){
			colunas.push(colunaDir);
		}
	}
	return colunas;
}

// retorna a(s) coordenada(s) y do(s) quadrado(s)
Dots.prototype.yQuadrado = function(_jogada, _orientacao){
	var linhas = Array();
	var linha = (_jogada-1)/(2*dots.numeroColunas-1);
	linha = parseInt(linha, 10);
	if (_orientacao == 0){
		var linhaAcima = linha - 1;
		if (linhaAcima >= 0){
			linhas.push(linhaAcima)
		}
		if (linha < dots.numeroLinhas-1){
			linhas.push(linha);
		}
	}
	if (_orientacao == 1){
		linhas.push(linha);
	}
	return linhas;
}

// [0] - horizontal / [1] - vertical
Dots.prototype.orientacao = function(_jogada){
	var orientacao = ((_jogada-1)%(2*dots.numeroColunas-1));
	if (orientacao < (dots.numeroColunas-1)){
		return 0;
	}
	else{
		return 1;
	}
}

$(document).ready(function(){

	$("#gerar").click(function(){
		dots = new Dots($("#numeroLinhas").val(), $("#numeroColunas").val());		
		var euComeco = document.getElementById('comeca').checked;
		if (euComeco==0){
			dots.agenteJoga();
		}
		dots.atualizaMalha();
	});

	$(document).on("click", ".linha-vertical, .linha-horizontal", function(){
		$(this).addClass("marcado");
		var jogada_pessoa = parseInt($(this).attr("data-indice"), 10); // Base 10
		dots.jogadorJoga(jogada_pessoa);
		dots.agenteJoga();
	});

});


function geraMalhaQuadrados(malhaQuadrados, _linhas, _colunas){
	var linhasQuadrados = _linhas - 1,
		colunasQuadrados = _colunas - 1,
		html = "";
	for(var y = 0; y < linhasQuadrados; y++){
		for(var x = 0; x < colunasQuadrados; x++){
			var chave = x + "" + y;
			html += "<div id='fundo-quadrado" + chave + "' class='fundo-quadrado'></div>";
		}
	}
	malhaQuadrados.html(html);
}

function Dots(_linhas, _colunas){
	this.agente = new Agente();
	this.tabuleiro = new Tabuleiro(_linhas, _colunas);
	this.malhaDom = $("#malha");
	this.malhaQuadrados = $("#malha-quadrados");
	geraMalhaQuadrados(this.malhaQuadrados, _linhas, _colunas);
	this.malhaQuadrados.height( (_linhas-1) * 40 + _linhas * 16 );
	this.malhaQuadrados.width( (_colunas-1) * 40 + _colunas * 16 );
}

Dots.prototype.pintaFundoQuadrado = function(x, y, classe, innerHtml){ // classe == "fundo-quadrado-jogador" ou classe == "fundo-quadrado-pc"
	var chave = x + "" + y;
	var id = "#fundo-quadrado" + chave;
	var quadradoDom = $(id);
	if(!quadradoDom.hasClass(classe)){
		quadradoDom.addClass(classe);
		quadradoDom.html(innerHtml);
	}
};

Dots.prototype.pintaFundoQuadrados = function(){
	for (quadradoIndex in this.tabuleiro.quadradosJogador){
		var quadrado = this.tabuleiro.quadradosJogador[quadradoIndex];
		var x = quadrado[0];
		var y = quadrado[1];
		var innerHtml = "<p>JO</p>";
		this.pintaFundoQuadrado(x, y, "fundo-quadrado-jogador", innerHtml);
	}
	
	for (quadradoIndex in this.tabuleiro.quadradosComputador){
		var quadrado = this.tabuleiro.quadradosComputador[quadradoIndex];
		var x = quadrado[0];
		var y = quadrado[1];
		var innerHtml = "<p>PC</p>";
		this.pintaFundoQuadrado(x, y, "fundo-quadrado-pc", innerHtml);
	}
};

Dots.prototype.getHtmlElemento = function(classe, indice){
	var template = '<div class="%class%" data-indice="%indice%"></div>';
	return template.replace("%class%", classe).replace("%indice%", indice); 
}

Dots.prototype.getHtmlLinhaHorizontal = function(indice, marcado){
	marcado_classe = (marcado === true) ? "marcado" : "";
	return this.getHtmlElemento("linha-horizontal " + marcado_classe, indice);
}

Dots.prototype.getHtmlLinhaVertical = function(first, indice, marcado){
	marcado_classe = (marcado === true) ? "marcado" : "";
	if(first){
		return this.getHtmlElemento("linha-vertical linha-vertical-first " + marcado_classe, indice);
	}
	return this.getHtmlElemento("linha-vertical " + marcado_classe, indice);
}

Dots.prototype.getHtmlVertice = function(first){
	if(first){
		return this.getHtmlElemento("vertice vertice-first", 0);
	}
	return this.getHtmlElemento("vertice", 0);
}

Dots.prototype.getHtmlPlacar = function(){
    var placar_pc = this.tabuleiro.quadradosComputador.length;
    var placar_jogador = this.tabuleiro.quadradosJogador.length;
    var html = "<b>Placar:</b> pc " + placar_pc + " x " + placar_jogador + " jogador<br />";
	var resultadoFinal = "</p><br />";
    if(placar_pc + placar_jogador == this.tabuleiro.linhasQuadrados * this.tabuleiro.colunasQuadrados){
        var resultado = "<span class='empate'>Deu empate!</span>";
        if(placar_pc != placar_jogador){
            if(placar_pc < placar_jogador){
                resultado = "<span class='vencedor'>Vencedor: jogador! :) </span>&nbsp;<span class='perdedor'>Perdedor: PC! :( </span>";
            }
            else{
                resultado = "<span class='vencedor'>Vencedor: PC! :) </span>&nbsp;<span class='perdedor'>Perdedor: jogador! :( </span>";
            }
        }
        resultadoFinal = "<b class='acabou'>ACABOU!</b>&nbsp;" + resultado + "</p><br />";
    }
	html += resultadoFinal;
    return html;
}

Dots.prototype.getHtmlMalha = function(){
	var html = "<p class='resultado-tabuleiro'><b>Malha:</b> " + this.tabuleiro.linhas + " x " + this.tabuleiro.colunas + " <br />";
	html += this.getHtmlPlacar();
	var linha = 1;
	html += " <div class='malha-escrita'> ";
	for(var i = 0; i < this.tabuleiro.linhas; i++){
		if(i > 0){
			for(var j = 0; j < this.tabuleiro.colunas; j++){
				html += this.getHtmlLinhaVertical(j==0, linha, this.tabuleiro.arestaMarcada(linha-1));
				linha++;
			}		
		}
		for(var j = 0; j < this.tabuleiro.colunas; j++){
			if(j == 0){
				html += this.getHtmlVertice(true);
			}
			else{
				html += this.getHtmlLinhaHorizontal(linha, this.tabuleiro.arestaMarcada(linha-1));
				linha++;
				html += this.getHtmlVertice(false);
			}
		}
	}
	html += " </div> ";
	return html;
}

Dots.prototype.atualizaMalha = function(){
	this.malhaDom.html(this.getHtmlMalha());
	this.pintaFundoQuadrados(); // Atualiza Fundos
}

Dots.prototype.trocaVez = function(){
    if(vez == "computador"){ // Terminou de executar o pc
        vez = "jogador";
    }
    else{  // Terminou de jogar o jogador
        vez = "computador";
    }
}

Dots.prototype.jogadorJoga = function(jogadaPessoa){
    jogadaPessoa--;
    var placar_jogador_antes = this.tabuleiro.quadradosJogador.length;
	this.tabuleiro.marcaArestas(jogadaPessoa, "jogador");
    var placar_jogador_depois = this.tabuleiro.quadradosJogador.length;
    if(placar_jogador_antes == placar_jogador_depois){ // Jogador não marcou quadrados
        this.trocaVez();
    }
    this.atualizaMalha();
}

Dots.prototype.agenteJoga = function(){
	var jogadaComputador = this.agente.jogadaComputador(this.tabuleiro.clone());
	this.tabuleiro.marcaArestas(jogadaComputador, "computador");
	this.trocaVez();
	this.atualizaMalha();
}

$(document).ready(function(){

	$("#gerar").click(function(){
	    var _linhas = parseInt($("#numeroLinhas").val(), 10);
	    var _colunas = parseInt($("#numeroColunas").val(), 10);
	    var erro = false;
	    if(isNaN(_linhas) || _linhas < 2){
	        $("#erroLinhas").html("É necessário um número menor de 2");
	        erro = true;
	    }
	    if(isNaN(_colunas) || _colunas < 2){
	        $("#erroColunas").html("É necessário um número menor de 2");
	        erro = true;
	    }
	    if(erro){
	        return;
	    }
	    else{
	        $(".erro").html("");
	    }
	    
		dots = new Dots(_linhas, _colunas);
		var euComeco = document.getElementById('comeca').checked;
		if (euComeco==0){
		    vez = "computador";
			dots.agenteJoga();
		}
		else{
		    vez = "jogador";
		}
		dots.atualizaMalha();
	});

	$(document).on("click", ".linha-vertical, .linha-horizontal", function(){
		$(this).addClass("marcado");
		var jogada_pessoa = parseInt($(this).attr("data-indice"), 10); // Base 10
		if(vez == "jogador"){
		    dots.jogadorJoga(jogada_pessoa);
		}
		while(vez == "computador"){
		    dots.agenteJoga();
		}
	});

});


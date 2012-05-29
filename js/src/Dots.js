function Dots(_linhas, _colunas){
	this.agente = new Agente();
	this.tabuleiro = new Tabuleiro(_linhas, _colunas);
}

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

Dots.prototype.getHtmlMalha = function(){
	var html = "<p>Malha " + this.tabuleiro.linhas + " x " + this.tabuleiro.colunas + " <br />";
	html += "Placar: pc " + this.tabuleiro.quadradosComputador.length + " x " + this.tabuleiro.quadradosJogador.length + " jogador</p><br />";
	var linha = 1;
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
	return html;
}

Dots.prototype.atualizaMalha = function(){
	$("#malha").html(this.getHtmlMalha());
}

Dots.prototype.jogadorJoga = function(jogadaPessoa){
    jogadaPessoa--;
	this.tabuleiro.marcaArestas(jogadaPessoa, "jogador");
	this.atualizaMalha();
}

Dots.prototype.agenteJoga = function(){
	var jogadaComputador = this.agente.jogadaComputador(this.tabuleiro.clone());
	this.tabuleiro.marcaArestas(jogadaComputador, "computador");
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
		if(vez == "computador"){
		    dots.agenteJoga();
		}
	});

});


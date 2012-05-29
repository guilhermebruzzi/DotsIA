function Agente(){
}

Agente.prototype.jogadaComputador = function(tabuleiro){
	for(var y = 0; y < tabuleiro.linhas; y++){
	    for(var x = 0; x < tabuleiro.colunas; x++){
	        quadrado = tabuleiro.getQuadradoArestas(x, y);
	        for (var aresta_index in quadrado){
	            var aresta = quadrado[aresta_index]
	            if(!tabuleiro.arestaMarcada(aresta)){
	                return aresta
	            }
	        }
	    }
	}
}	

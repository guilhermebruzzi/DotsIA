function Agente(){
}

Agente.prototype.jogadaComputador = function(tabuleiro){
	for(var y = 0; y < tabuleiro.linhasQuadrados; y++){
	    for(var x = 0; x < tabuleiro.colunasQuadrados; x++){
	        var arestas = tabuleiro.getQuadradoArestas(x, y);
	        for (var aresta_index in arestas){
	            var aresta = arestas[aresta_index];
	            if(!tabuleiro.arestaMarcada(aresta)){
	                return aresta;
	            }
	        }
	    }
	}
	return 1;
}	

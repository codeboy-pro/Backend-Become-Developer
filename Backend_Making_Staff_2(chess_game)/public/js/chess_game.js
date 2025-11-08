const socket=io();

const chess=new Chess();
const boardElement = document.querySelector(".chessboard");


let draggedPiece=null;
let sourceSquare=null;
let playerRole=null;

const getPieceUnicode = (piece) => {
// Use piece color to determine which Unicode character to use
if (piece.color === 'w') {
  // White pieces - outline characters
  const whiteUnicode = {
    k: "♔", // White King
    q: "♕", // White Queen  
    r: "♖", // White Rook
    b: "♗", // White Bishop
    n: "♘", // White Knight
    p: "♙"  // White Pawn
  };
  return whiteUnicode[piece.type] || "";
} else {
  // Black pieces - solid characters
  const blackUnicode = {
    k: "♚", // Black King
    q: "♛", // Black Queen
    r: "♜", // Black Rook
    b: "♝", // Black Bishop
    n: "♞", // Black Knight
    p: "♟"  // Black Pawn
  };
  return blackUnicode[piece.type] || "";
}
};

const renderBoard=()=>{
    const board=chess.board();
    boardElement.innerHTML="";
    console.log(board);
    board.forEach((row,rowindex) => {
        row.forEach((squre,squreindex)=>{
          const squreElement=document.createElement("div");
            squreElement.classList.add("square",
                (rowindex+squreindex)%2===0?"light":"dark"

            );
            squreElement.dataset.row=rowindex;
            squreElement.dataset.col=squreindex;

            if(squre){
                const pieceElement= document.createElement("div");
                pieceElement.classList.add("piece",squre.color==='w'?"white":"black");
                pieceElement.innerText=getPieceUnicode(squre);
                pieceElement.draggable=(playerRole===squre.color);
                pieceElement.addEventListener("dragstart",(e)=>{
                    if(pieceElement.draggable){
                        draggedPiece=pieceElement;
                        sourceSquare={row:rowindex,col:squreindex};
                        e.dataTransfer.setData("text/plain","");
                    }
                });
           pieceElement.addEventListener("dragend",(e)=>{
            draggedPiece=null;
            sourceSquare=null;

           });
           squreElement.append(pieceElement);

            }
squreElement.addEventListener("dragover",function(e){
    e.preventDefault();
});

squreElement.addEventListener("drop",function(e){
    e.preventDefault();
    if(draggedPiece){
        const targetSource={
            row: parseInt(squreElement.dataset.row),
            col:parseInt(squreElement.dataset.col),
        }
        handleMove(sourceSquare,targetSource);
    }
});
boardElement.appendChild(squreElement);
        });
        
    });


    if(playerRole==='b'){
        boardElement.classList.add("flipped");
    }
else{
    boardElement.classList.remove("flipped");
}
};

renderBoard();



const handleMove=(source,target)=>{
   const move={
    from:  `${String.fromCharCode(97+source.col)}${8-source.row}`,

to: `${String.fromCharCode(97+target.col)}${8-target.row}`,
promotion: 'q'
   }   
socket.emit("move",move);


}

socket.on("playerRole",function(role){
    playerRole=role;
    renderBoard();

});
socket.on("spectatorRole",function(role){
    playerRole=null;
    renderBoard();

});


socket.on("boardState",function(fen){
 chess.load(fen);
 renderBoard();
});


socket.on("move",function(move){
 chess.move(move);
 renderBoard();
});



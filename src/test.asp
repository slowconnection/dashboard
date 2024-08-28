<html xmlns="http://www.w3.org/1999/xhtml">
<head><title></title>
    <style>
        div{width:200px; height:100px; border:1px solid #444; display:inline-block;}
    </style>

</head>
<body>
    <div id="div1" draggable="true" ondrop="drop(event)" ondragover="allowDrop(event)"><h1>Draggable Div</h1></div>
    <div id="div2"><h1>Non-draggable</h1></div>

    

    <script type="text/javascript">
        function allowDrop(ev) {
            ev.preventDefault();
        }

        function drag(ev) {
            ev.dataTransfer.setData("text", ev.target.id);
        }

        function drop(ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            console.log({ data, ev });
            //ev.target.appendChild(document.getElementById(data));
        }
    </script>

</body>
</html>

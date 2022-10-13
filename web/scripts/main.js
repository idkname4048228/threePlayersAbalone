const svg = document.getElementById('svg');
const holes = [];
for (let row = 0; row < 9; row++) {
    holes.push([]);
    var y = (100 - ((4 - row) * 10 * Math.sqrt(3))).toString();
    for (let cloumn = 0; cloumn < 9 - (Math.abs(4 - row)); cloumn++) {
        const hole = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        const mark = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        holes[row].push(hole);
        var x = (11 - (9 - (Math.abs(4 - row)))) * 10;
        var id = (row * 10 + cloumn).toString().padStart(2, 0);

        function setElementToHole(hole) {
            hole.setAttribute('id', "hole-" + id);
            hole.setAttribute('x', (x + (20 * cloumn)).toString().padStart(2, 0));
            hole.setAttribute('y', y.toString());
            hole.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#hole');
            hole.setAttribute("fill", 'url(#hole-color)')
            hole.setAttribute('stroke', '#888888');
            hole.setAttribute('stroke-width', '1.5');
        }
        function setHoleToPlayerPiece(hole, num) {
            const map = ["22bc22", "bc2222", "2222bc"]
            hole.setAttribute("fill", 'url(#player' + num + '-color)')
            hole.setAttribute('stroke', map[num]);
            hole.setAttribute('stroke-width', '0.5');
        }
        function setElementToMark(mark) {
            mark.setAttribute('id', "mark-" + id);
            mark.setAttribute('x', (x + (20 * cloumn)).toString());
            mark.setAttribute('y', y);
            mark.setAttribute('stroke-opacity', '0');
            mark.setAttribute('be-click', '0');
            mark.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#select');
        }
        setElementToHole(hole);
        setElementToMark(mark);

        if (id === "03" || id === "04" || id === "13" || id === "14" || id === "15" || id === "23" || id === "24" || id === "25" || id === "35") setHoleToPlayerPiece(hole, 0);
        if (id === "30" || id === "31" || id === "32" || id === "40" || id === "41" || id === "42" || id === "50" || id === "51" || id === "52") setHoleToPlayerPiece(hole, 1);
        if (id === "63" || id === "73" || id === "83" || id === "64" || id === "74" || id === "84" || id === "55" || id === "65" || id === "75") setHoleToPlayerPiece(hole, 2);



        mark.addEventListener('mouseenter', () => {
            console.log('in');
            mark.setAttribute('stroke-opacity', '1');
        });
        mark.addEventListener('mouseleave', () => {
            console.log('out');
            if (mark.getAttribute('be-click') === '0')
                mark.setAttribute('stroke-opacity', '0');
        });
        mark.addEventListener('click', () => {
            mark.setAttribute('be-click', (mark.getAttribute('be-click') === '0') ? '1' : '0');
            mark.setAttribute('stroke-opacity', '1');
            const modify_hole = document.getElementById("hole-" + mark.getAttribute('id').slice(-2));

            console.log(mark.getAttribute('id').slice(-2));
        })


        svg.appendChild(hole);
        svg.appendChild(mark);
    }
}
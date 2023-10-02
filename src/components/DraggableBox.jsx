import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

function DraggableBoxesWithLines() {
  const [boxes, setBoxes] = useState([
    { id: 1, name: "Google", x: 50, y: 50, icon: "/googleLogo.png" },
    {
      id: 2,
      name: "New York-Sites",
      x: 200,
      y: 100,
      icon: "h1",
      children: [
        { id: 5, name: "yahoo", x: -50, y: 50, icon: "h5" },
        { id: 6, name: "Gmail", x: 50, y: 50, icon: "h6" },
        { id: 7, name: "hotmail", x: 50, y: 50, icon: "h7" },
        { id: 8, name: "outlook", x: 50, y: 50, icon: "h8" },
      ],
    },
    {
      id: 3,
      name: "New Jersey-Sites",
      x: 100,
      y: 200,
      icon: "h2",
      children: [{ id: 5, name: "facebook", x: -50, y: 50, icon: "h9" }],
    },
    { id: 4, name: "Vermont-Sites", x: 250, y: 250, icon: "h3",children: [{ id: 5, name: "youtube", x: -50, y: 50, icon: "h10" }], },
  ]);

  const svgRef = useRef(null);
  const isDraggingRef = useRef(false);
  const initialMousePositionRef = useRef({ x: 0, y: 0 });

  const handleDragStart = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    initialMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleDrag = (e, parentId) => {
    if (!isDraggingRef.current) return;

    const updatedBoxes = [...boxes];

    const boxIndex = updatedBoxes.findIndex((box) => box.id === parentId);
    if (boxIndex !== -1) {
      const offsetX = e.clientX - initialMousePositionRef.current.x;
      const offsetY = e.clientY - initialMousePositionRef.current.y;
      initialMousePositionRef.current = { x: e.clientX, y: e.clientY };
      updatedBoxes[boxIndex] = {
        ...updatedBoxes[boxIndex],
        x: updatedBoxes[boxIndex].x + offsetX,
        y: updatedBoxes[boxIndex].y + offsetY,
      };
      setBoxes(updatedBoxes);
    }
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("line").remove();
    for (let i = 1; i < boxes.length; i++) {
      svg
        .append("line")
        .attr("x1", boxes[0].x + 130)
        .attr("y1", boxes[0].y + 116)
        .attr("x2", boxes[i].x + 130)
        .attr("y2", boxes[i].y + 0)
        .attr("stroke", "black");
    }
  }, [boxes]);
  useEffect(() => {
    document.addEventListener("mouseup", handleDragEnd);
    return () => {
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, []);
  return (
    <>
      <svg ref={svgRef}></svg>
      {boxes.map((box) => (
        <div
          key={box.id}
          className="box"
          style={{ left: `${box.x}px`, top: `${box.y}px` }}
          onMouseDown={(e) => handleDragStart(e, box.id)}
          onMouseMove={(e) => handleDrag(e, box.id)}
          onMouseUp={handleDragEnd}
        >
          <div className="boxChildContainer">
            {box.children ? (
              box.children.map((child) => (
                <div key={child.id} className="boxChild">
                  <div className="boxChildIcon"></div>{" "}
                  <div className="boxChildName">{child.name}</div>
                </div>
              ))
            ) : (
              <div className="boxIcon">
                <img src={box.icon} alt="img" />
              </div>
            )}
          </div>
          <div className="boxTitle absolute"><span className="boxLabel"></span><span className="pt-1">{box.name}</span></div>
        </div>
      ))}
    </>
  );
}

export default DraggableBoxesWithLines;

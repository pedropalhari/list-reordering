import styled from "@emotion/styled";
import { DragHandlers, motion, useDragControls } from "framer-motion";
import { useRef, useState } from "react";

const Block = styled(motion.div)`
  background-color: red;
  border-radius: 5px;
  width: 300px;
  height: 100px;

  margin-top: 10px;
`;

const OutsideBlock = styled(motion.div)`
  background-color: green;
  border-radius: 5px;
  width: 300px;
  height: 100px;

  margin-top: 10px;
`;

export function DraggableReset({
  onDrag,
  onDragStart,
  onDragEnd,
}: {
  onDrag: DragHandlers["onDrag"];
  onDragStart: DragHandlers["onDragStart"];
  onDragEnd: DragHandlers["onDragEnd"];
}) {
  let [_, setState] = useState(0);

  function forceUpdate() {
    setState((c) => c + 1);
  }

  return (
    <OutsideBlock
      layout
      drag
      whileDrag={{ opacity: 0.5 }}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={(...args) => onDragEnd && onDragEnd(...args) && forceUpdate()}
    />
  );
}

export default function App() {
  let [items, setItems] = useState<{ type: string; id: number }[]>([
    { type: "BLOCK", id: 1 },
    { type: "BLOCK", id: 2 },
    { type: "BLOCK", id: 3 },
    { type: "BLOCK", id: 4 },
  ]);
  let refs = useRef<({ ref: HTMLDivElement | null; id: number } | null)[]>(
    new Array(items.length).fill(null)
  );

  console.log(items);

  return (
    <div>
      {items.map(({ type, id }, index) => {
        if (type === "CURSOR")
          return (
            <motion.div layout key={id}>
              opa
            </motion.div>
          );
        else if (type === "BLOCK")
          return (
            <Block
              ref={(r) => (refs.current[index] = { ref: r, id })}
              drag="y"
              onDrag={(event, info) => {
                let currentY = info.point.y;

                let bottomContainer = items[index + 1];
                let upperContainer = items[index - 1];

                if (bottomContainer) {
                  let bottomContainerRef = refs.current.find(
                    (bcr) => bcr && bcr.id === bottomContainer.id
                  );

                  if (bottomContainerRef) {
                    let top = bottomContainerRef.ref?.offsetTop as number;

                    if (currentY > top) {
                      let newItemArray = [...items];
                      let aux: any;

                      aux = newItemArray[index + 1];
                      newItemArray[index + 1] = newItemArray[index];
                      newItemArray[index] = aux;
                      setItems(newItemArray);
                      return;
                    }
                  }
                }

                if (upperContainer) {
                  let upperContainerRef = refs.current.find(
                    (bcr) => bcr && bcr.id === upperContainer.id
                  );

                  if (upperContainerRef) {
                    let top = upperContainerRef.ref?.offsetTop as number;
                    let height = upperContainerRef.ref?.clientHeight as number;

                    if (currentY < top + height) {
                      let newItemArray = [...items];
                      let aux: any;

                      aux = newItemArray[index - 1];
                      newItemArray[index - 1] = newItemArray[index];
                      newItemArray[index] = aux;

                      setItems(newItemArray);
                      return;
                    }
                  }
                }
              }}
              onDragEnd={(evt, info) => {
                setItems([...items]);
              }}
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.12 }}
              layout
              key={id}
            />
          );
      })}

      <div style={{ marginTop: 100 }}>
        <DraggableReset
          onDragStart={() => {
            setItems((c) => [...c, { type: "CURSOR", id: 9999 }]);
          }}
          onDragEnd={() => {
            let currentCursorIndex = items.findIndex(
              (i) => i.type === "CURSOR"
            );
            setItems((c) => {
              let arr = [...c];
              arr.splice(currentCursorIndex, 0, {
                type: "BLOCK",
                id: items.length + 1,
              });

              return arr.filter((i) => i.type != "CURSOR");
            });
          }}
          onDrag={(event, info) => {
            let index = items.findIndex((i) => i.type === "CURSOR");

            if (index === -1) return;

            let currentY = info.point.y;

            let bottomContainer = items[index + 1];
            let upperContainer = items[index - 1];

            if (bottomContainer) {
              let bottomContainerRef = refs.current.find(
                (bcr) => bcr && bcr.id === bottomContainer.id
              );

              if (bottomContainerRef) {
                let top = bottomContainerRef.ref?.offsetTop as number;

                if (currentY > top) {
                  let newItemArray = [...items];
                  let aux: any;

                  aux = newItemArray[index + 1];
                  newItemArray[index + 1] = newItemArray[index];
                  newItemArray[index] = aux;
                  setItems(newItemArray);
                  return;
                }
              }
            }

            if (upperContainer) {
              let upperContainerRef = refs.current.find(
                (bcr) => bcr && bcr.id === upperContainer.id
              );

              if (upperContainerRef) {
                let top = upperContainerRef.ref?.offsetTop as number;

                if (currentY < top) {
                  let newItemArray = [...items];
                  let aux: any;

                  aux = newItemArray[index - 1];
                  newItemArray[index - 1] = newItemArray[index];
                  newItemArray[index] = aux;

                  setItems(newItemArray);
                  return;
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}

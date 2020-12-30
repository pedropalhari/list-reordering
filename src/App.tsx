import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import { DragHandlers, motion, useDragControls } from "framer-motion";
import { useRef, useState } from "react";

const MainContainer = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  grid-template-columns: 200px 1fr 200px;
`;

const LeftContainer = styled.div`
  width: 100%;
  background-color: red;
  height: 100vh;
`;

const MiddleContainer = styled.div`
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;

  display: flex;
  align-items: center;
  flex-direction: column;
`;

const RightContainer = styled.div`
  width: 100%;
  background-color: blue;
  height: 100vh;

  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 10px;
  padding: 5px;
`;

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
  width: 60px;
  height: 60px;
`;

const DroppingBlock = styled(motion.hr)`
  border: none;
  border-top: 3px dotted green;
  color: transparent;
  background-color: transparent;
  height: 1px;
  width: 100%;
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
  let [items, setItems] = useState<
    { type: string; id: number; subtype: string }[]
  >([
    { type: "BLOCK", subtype: "TEXT", id: 1 },
    { type: "BLOCK", subtype: "TEXT", id: 2 },
    { type: "BLOCK", subtype: "TEXT", id: 3 },
    { type: "BLOCK", subtype: "TEXT", id: 4 },
  ]);
  let refs = useRef<({ ref: HTMLDivElement | null; id: number } | null)[]>(
    new Array(items.length).fill(null)
  );
  let [showDrop, setShowDrop] = useState(false);

  return (
    <MainContainer>
      <Global
        styles={css`
          body {
            margin: 0px;
          }
        `}
      />

      <LeftContainer></LeftContainer>

      <MiddleContainer>
        {items.map(({ type, id }, index) => {
          if (type === "CURSOR" && showDrop)
            return <DroppingBlock layout key={id} />;
          else if (type === "BLOCK")
            return (
              <Block
                ref={(r) => refs.current.push({ ref: r, id })}
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
                      let height = upperContainerRef.ref
                        ?.clientHeight as number;

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
      </MiddleContainer>

      <RightContainer>
        <DraggableReset
          onDragStart={() => {
            setItems((c) => [
              ...c,
              { type: "CURSOR", subtype: "CURSOR", id: 9999 },
            ]);
          }}
          onDragEnd={() => {
            let currentCursorIndex = items.findIndex(
              (i) => i.type === "CURSOR"
            );
            setItems((c) => {
              let arr = [...c];

              if (showDrop)
                arr.splice(currentCursorIndex, 0, {
                  type: "BLOCK",
                  subtype: "TEXT",
                  id: items.length * 2 + 1,
                });

              return arr.filter((i) => i.type != "CURSOR");
            });
          }}
          onDrag={(event, info) => {
            let index = items.findIndex((i) => i.type === "CURSOR");

            if (index === -1) return;

            // Controller to show/hide drop, when the cursor is still inside the right panel
            if (document.body.clientWidth - info.point.x > 200 && !showDrop)
              setShowDrop(true);

            if (document.body.clientWidth - info.point.x < 200 && showDrop)
              setShowDrop(false);

            // Move the drop around as a block
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
      </RightContainer>
    </MainContainer>
  );
}

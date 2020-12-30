import { css, Global } from "@emotion/react";
import styled from "@emotion/styled";
import { DragHandlers, motion, useDragControls } from "framer-motion";
import { useAtom } from "jotai";
import React, { CSSProperties, useRef, useState } from "react";
import { ComponentStylesAtom, MetadataAtom, StylesAtom } from "./atoms";
import { Input } from "./components/Input";

const MainContainer = styled.div`
  display: grid;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  grid-template-columns: 200px 1fr 200px;
`;

const LeftContainer = styled.div`
  width: 100%;
  background-color: #1e1d29;
  height: 100vh;

  display: flex;
  flex-direction: column;

  color: white;

  padding: 10px;
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
  background-color: #1e1d29;
  height: 100vh;

  padding: 10px;
`;

const RightContainerGrid = styled.div`
  margin-top: 20px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(10, 60px);

  column-gap: 10px;
  row-gap: 30px;

  & > * {
    align-self: center;
    justify-self: center;
  }
`;

interface BlockProps {
  selected: boolean;
}

const Block = styled(motion.div)`
  background-color: #00000011;
  border-radius: 5px;
  width: 720px;
  min-height: 30px;

  margin-top: 10px;

  padding: 15px;

  display: flex;
  justify-content: center;

  border: ${(props: BlockProps) =>
    props.selected ? "solid 2px #f38f3d" : "none"};
`;

const OutsideBlock = styled(motion.div)`
  background-color: #2a2e3c;
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

const StyledText = styled.span`
  font-size: 32px;
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
      whileHover={{ scale: 1.05 }}
      onDrag={onDrag}
      onDragStart={onDragStart}
      onDragEnd={(...args) => onDragEnd && onDragEnd(...args) && forceUpdate()}
    />
  );
}

export default function App() {
  let [items, setItems] = useState<
    { type: string; id: number; subtype: string }[]
  >([]);
  let refs = useRef<({ ref: HTMLDivElement | null; id: number } | null)[]>(
    new Array(items.length).fill(null)
  );
  let [showDrop, setShowDrop] = useState(false);

  const [styles, setStyles] = useAtom(StylesAtom);
  const [componentStyles, setComponentStyles] = useAtom(ComponentStylesAtom);
  const [metadata, setMetadata] = useAtom(MetadataAtom);

  /**
   * -1 id is the body
   */
  const [selectedComponent, setSelectedComponent] = useState<number>(-1);

  function setContainerStyle(id: number, style: CSSProperties) {
    setStyles((s) => ({
      ...s,
      [id]: {
        ...s[id],
        ...style,
      },
    }));
  }

  function setComponentStyle(id: number, style: CSSProperties) {
    setComponentStyles((s) => ({
      ...s,
      [id]: {
        ...s[id],
        ...style,
      },
    }));
  }

  function setComponentMetadata(id: number, metadata: any) {
    setMetadata((s) => ({
      ...s,
      [id]: {
        ...s[id],
        ...metadata,
      },
    }));
  }

  console.log({ items });

  return (
    <MainContainer>
      <Global
        styles={css`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
          body {
            margin: 0px;
          }

          * {
            font-family: "Poppins";
            box-sizing: border-box;
          }

          button,
          input[type="submit"],
          input[type="reset"] {
            background: none;
            color: inherit;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            outline: inherit;
          }
        `}
      />

      <LeftContainer>
        <StyledText
          style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
          onClick={() => {
            setContainerStyle(11, { backgroundColor: "red" });
            setComponentMetadata(11, { placeholder: "wow" });
          }}
        >
          Properties
        </StyledText>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <StyledText
            style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
            onClick={() => {
              setContainerStyle(11, { backgroundColor: "red" });
              setComponentMetadata(11, { placeholder: "wow" });
            }}
          >
            Container
          </StyledText>
          {styles[selectedComponent] &&
            Object.keys(styles[selectedComponent]).map((key) => {
              let currentStyle = styles[selectedComponent];

              return (
                <>
                  <span>{key}</span>
                  <input
                    style={{ width: "100%" }}
                    value={(currentStyle as any)[key]}
                    onChange={(evt) =>
                      setContainerStyle(selectedComponent, {
                        [key]: evt.target.value,
                      })
                    }
                  />
                </>
              );
            })}

          <StyledText
            style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
            onClick={() => {
              setContainerStyle(11, { backgroundColor: "red" });
              setComponentMetadata(11, { placeholder: "wow" });
            }}
          >
            Component
          </StyledText>

          {metadata[selectedComponent] &&
            Object.keys(metadata[selectedComponent]).map((key) => {
              let currentMetadata = metadata[selectedComponent];

              return (
                <>
                  <span>{key}</span>
                  <input
                    style={{ width: "100%" }}
                    value={(currentMetadata as any)[key]}
                    onChange={(evt) =>
                      setComponentMetadata(selectedComponent, {
                        [key]: evt.target.value,
                      })
                    }
                  />
                </>
              );
            })}

          <StyledText
            style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
            onClick={() => {
              setContainerStyle(11, { backgroundColor: "red" });
              setComponentMetadata(11, { placeholder: "wow" });
            }}
          >
            Values
          </StyledText>
          {componentStyles[selectedComponent] &&
            Object.keys(componentStyles[selectedComponent]).map((key) => {
              let currentStyle = componentStyles[selectedComponent];

              return (
                <>
                  <span>{key}</span>
                  <input
                    style={{ width: "100%" }}
                    value={(currentStyle as any)[key]}
                    onChange={(evt) =>
                      setComponentStyle(selectedComponent, {
                        [key]: evt.target.value,
                      })
                    }
                  />
                </>
              );
            })}
        </div>
      </LeftContainer>

      <MiddleContainer style={styles[-1]}>
        {items.map(({ type, id, subtype }, index) => {
          if (type === "CURSOR" && showDrop)
            return <DroppingBlock layout key={id} />;
          else if (type === "BLOCK")
            return (
              <Block
                selected={selectedComponent === id}
                onClick={() => {
                  // Toggle between this selected and the body
                  setSelectedComponent((sc) => (sc === id ? -1 : id));
                }}
                ref={(r) => refs.current.push({ ref: r, id })}
                drag="y"
                style={styles[id]}
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
                whileDrag={{ scale: 1.12, zIndex: 9999 }}
                layout
                key={id}
              >
                {subtype === "TEXT" && (
                  <StyledText style={componentStyles[id]}>
                    {metadata[id]?.text}
                  </StyledText>
                )}

                {subtype === "INPUT" && (
                  // Explode the props
                  <Input style={{ width: 200 }} {...metadata[id]} />
                )}
              </Block>
            );
        })}
      </MiddleContainer>

      <RightContainer>
        <StyledText
          style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
        >
          Components
        </StyledText>

        <RightContainerGrid>
          {/* TEXT */}
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

              const id = items.length * 2 + 1;

              setItems((c) => {
                let arr = [...c];

                if (showDrop)
                  arr.splice(currentCursorIndex, 0, {
                    type: "BLOCK",
                    subtype: "TEXT",
                    id,
                  });

                return arr.filter((i) => i.type != "CURSOR");
              });

              setContainerStyle(id, {
                width: "720px",
                padding: "15px",
                margin: "10px",
              });

              setComponentStyle(id, {
                width: "100%",
                fontSize: 20,
                textAlign: "center",
                fontWeight: "normal",
              });

              setComponentMetadata(id, {
                text: "Default Text",
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

          {/* INPUT */}
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

              const id = items.length * 2 + 1;
              setItems((c) => {
                let arr = [...c];

                if (showDrop)
                  arr.splice(currentCursorIndex, 0, {
                    type: "BLOCK",
                    subtype: "INPUT",
                    id,
                  });

                return arr.filter((i) => i.type != "CURSOR");
              });

              setContainerStyle(id, {
                fontSize: 20,
                textAlign: "center",
                width: "720px",
                padding: "15px",
                margin: "10px",
                fontWeight: "normal",
              });

              setComponentMetadata(id, {
                placeholder: "Default text here",
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

          {/* INPUT CONTAINER */}
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
                    subtype: "INPUT_CONTAINER",
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

          {/* CHECKBOX */}
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
                    subtype: "CHECKBOX",
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
        </RightContainerGrid>
      </RightContainer>
    </MainContainer>
  );
}

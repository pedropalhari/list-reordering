import { atom } from "jotai";
import { CSSProperties } from "react";

type StylesMap = {
  [uuid: string]: CSSProperties;
};

const StylesAtom = atom<StylesMap>({});

export default StylesAtom;

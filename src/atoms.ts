import { atom } from "jotai";
import { CSSProperties } from "react";

type StylesMap = {
  [uuid: string]: CSSProperties;
};

type MetadataMap = {
  [uuid: string]: any;
};

export const StylesAtom = atom<StylesMap>({
  "-1": {
    backgroundColor: "white",
  },
});

export const MetadataAtom = atom<MetadataMap>({});

export const ComponentStylesAtom = atom<StylesMap>({});

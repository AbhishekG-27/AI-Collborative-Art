"use client";

import React from "react";
import { Image, Layer } from "react-konva";
import useImage from "use-image";

const AiImage = ({ imageBuffer }: { imageBuffer: string }) => {
  const [image, status] = useImage(imageBuffer);
  return (
    <Layer>
      <Image image={image} draggable={true} height={500} width={500} />
    </Layer>
  );
};

export default AiImage;

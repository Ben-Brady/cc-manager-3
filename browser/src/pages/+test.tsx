import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC } from "react";

import Container from "@/components/elements/Container";
import DynamicBlockMesh from "@/components/extensive/canvas/Block/DynamicBlockMesh";
import { Block } from "@/hook/useBlocks";

const TestPage: FC = () => {
    const blocks: Block[] = [
        {
            name: "minecraft:oak_planks",
            position: { x: 0, y: 0, z: 0 },
            lastDetected: Date.now(),
        },
        {
            name: "minecraft:oak_stairs",
            position: { x: -2, y: 0, z: 0 },
            lastDetected: Date.now(),
        },
        {
            name: "minecraft:carrots",
            position: { x: 2, y: 0, z: 0 },
            lastDetected: Date.now(),
        },
    ];

    return (
        <div className="flex flex-col p-4 items-center">
            <Container className="w-160 h-96">
                <Canvas>
                    <OrbitControls />
                    <ambientLight intensity={1} />
                    {/* <MissingBlockMesh block={block} meshProps={{}} /> */}
                    {blocks.map((block) => (
                        <DynamicBlockMesh
                            block={block}
                            meshProps={{}}
                            isOverlappingTurtle={false}
                            texture={undefined}
                        />
                    ))}
                </Canvas>
            </Container>
        </div>
    );
};

export default TestPage;

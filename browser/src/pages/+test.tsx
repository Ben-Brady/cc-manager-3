import Container from "@/components/elements/Container";
import BlockMesh from "@/components/extensive/canvas/BlockMesh";
import { vec3ToArray } from "@/components/extensive/canvas/ComputerCanvas";
import DynamicBlockMesh from "@/components/extensive/canvas/DynamicBlockMesh";
import FullBlockMesh from "@/components/extensive/canvas/FullBlockMesh";
import MissingBlockMesh from "@/components/extensive/canvas/MissingBoxMesh";
import { Block } from "@/hook/useBlocks";
import { MISSING_TEXTURE } from "@/lib/three/loader";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FC } from "react";

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
    ];

    return (
        <div className="flex flex-col p-4 items-center">
            <Container className="w-160 h-96">
                <Canvas>
                    <OrbitControls />
                    <ambientLight intensity={1} />
                    {/* <MissingBlockMesh block={block} meshProps={{}} /> */}
                    {blocks.map((block) => (
                        <BlockMesh
                            block={block}
                            isOverlappingTurtle={false}
                            setTooltip={() => void 0}
                        />
                    ))}
                </Canvas>
            </Container>
        </div>
    );
};

export default TestPage;

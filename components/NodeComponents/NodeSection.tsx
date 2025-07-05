"use client"
import { Badge, Card, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface NodeSectionProps {
    title: string;
}

const NodeSection = (props: NodeSectionProps) => {
    const {title} = props;
    return (
        <div className="mb-8 p-4 bg-gray-900 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
            <Divider/>
            <div className="w-auto">
                <Card key="" className="p-4 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
                    <Link href={`/node/cmcgnmgey0001ka8hzzzmyk50`} className="z-0">test</Link>
                    <div className="flex items-center mb-2">
                        <Icon icon="lucide:whole-word" />
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default NodeSection;
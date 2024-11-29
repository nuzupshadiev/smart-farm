"use client";
import {
  Button,
  Card,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";

export default function PlantInfo() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 pb-[100px]">
      {/* Top Section with Image and Title */}
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4">Sansevieria</h1>
        <div className="relative w-40 h-40">
          <Image
            shadow="sm"
            radius="lg"
            width="100%"
            alt={"asd"}
            className="w-full object-cover h-[140px]"
            src={
              "https://media.istockphoto.com/id/1380361370/photo/decorative-banana-plant-in-concrete-vase-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=eYADMQ9dXTz1mggdfn_exN2gY61aH4fJz1lfMomv6o4="
            }
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-col gap-4 w-full">
        {/* Frequency */}
        <InfoCard label="Frequency" value="1/week" />
        {/* Water */}
        <InfoCard label="Water" value="250 Ml" />
        {/* Temperature */}
        <InfoCard label="Temperature" value="15 - 24 °C" />
        {/* Light */}
        <InfoCard label="Moisture" value="55%" />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex flex-col items-center gap-3 w-full">
        <Button fullWidth>Water</Button>
        <Button fullWidth onPress={onOpen}>
          Update
        </Button>
      </div>

      {/* update part */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"center"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Modal Title
              </ModalHeader>
              <ModalBody>asd</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

// Reusable Info Card Component
function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4 flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="text-gray-500">{value}</p>
    </Card>
  );
}

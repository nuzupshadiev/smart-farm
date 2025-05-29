"use client";

import React, { useEffect } from "react";
import { Button } from "@nextui-org/button";
import { parseAbsoluteToLocal } from "@internationalized/date";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Tab,
  Tabs,
  useDisclosure,
  Selection,
  TimeInput,
  TimeInputValue,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

import Plant, { PlantT } from "@/src/API/plants";
import { useUserContext } from "@/utils/user-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { on } from "events";

function Plants() {
  const {
    onOpen: onOpenDelete,
    isOpen: isOpenDelete,
    onOpenChange: onOpenChangeDelete,
  } = useDisclosure();
  const { user } = useUserContext();
  const [plants, setPlants] = React.useState<PlantT[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [plantName, setPlantName] = React.useState("");
  const [plantImage, setPlantImage] = React.useState<File | null>(null);
  const [time, setTime] = React.useState("");
  const [frequency, setFrequency] = React.useState<Selection>(
    new Set(["days"])
  );
  const [interval, setInterval] = React.useState("");
  const [timeOfDay, setTimeOfDay] = React.useState<TimeInputValue>(
    parseAbsoluteToLocal("2024-04-08T18:45:22Z")
  );
  const [selectedTab, setSelectedTab] = React.useState("manual");

  const router = useRouter();

  useEffect(() => {
    Plant.getPlants(user).then((plantsResp) => {
      setPlants(plantsResp.plants);
    });
  }, [user]);

  const onSavePlant = React.useCallback(() => {
    // Save the plant
    if (selectedTab === "auto") {
      if (
        frequency === "all" ||
        frequency.size === 0 ||
        interval === "" ||
        timeOfDay === null ||
        plantName === "" ||
        plantImage === null
      ) {
        console.log("Please fill all the fields to continue");
        return;
      }
    } else if (plantName === "" || plantImage === null || time === "") {
      console.log("Please fill all the fields to continue 2");
      return;
    }

    Plant.addPlant(user, {
      name: plantName,
      image: plantImage,
      auto_mode: selectedTab === "auto",
      watering:
        selectedTab === "auto"
          ? {
              interval_type: frequency.values().next().value as
                | "days"
                | "weeks"
                | "months",
              interval_value: parseInt(interval),
              time_of_day: timeOfDay.toString(),
            }
          : {
              duration: parseInt(time),
            },
    }).then((plant) => {
      const newPlant = {
        plant_id: plant.data.plant_id,
        name: plant.data.name,
        image_url: plant.data.image_url,
        soil_moisture: plant.data.soil_moisture,
        status: plant.data.status,
      };

      setPlants([...plants, newPlant]);
      onOpenChange();
    });
  }, [
    plantName,
    time,
    frequency,
    interval,
    timeOfDay,
    plantImage,
    plants,
    onOpenChange,
    selectedTab,
  ]);

  const handleImageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        setPlantImage(file);
      }
    },
    []
  );

  return (
    <div className="overflow-hidden h-full bg-default-100 pb-[100px]">
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">My Plants</h1>
            <p className="text-default-500 text-default-400">
              List of my plants
            </p>
          </div>
          <Button variant="solid" color="primary" onPress={onOpen}>
            Add a plant
          </Button>
        </div>
      </div>
      <div className="gap-6 grid grid-cols-2 px-5">
        {plants.map((item, index) => (
          <Card
            key={index}
            isPressable
            shadow="sm"
            onPress={() => router.push(`/plants/${item.plant_id}`)}
          >
            <CardBody className="overflow-visible p-0 bg-primary-100">
              <Image
                alt={item.name}
                className="w-full object-cover h-[140px]"
                radius="lg"
                shadow="sm"
                src={
                  "https://media.istockphoto.com/id/1380361370/photo/decorative-banana-plant-in-concrete-vase-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=eYADMQ9dXTz1mggdfn_exN2gY61aH4fJz1lfMomv6o4="
                }
                width="100%"
              />
              <Button
                isIconOnly
                variant="flat"
                className="absolute top-2 right-2 z-10"
                onPress={onOpenDelete}
              >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </CardBody>
            <CardFooter className="text-small justify-between bg-primary-100">
              <b>{item.name}</b>
              <p className="text-default-500">{item.soil_moisture}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add a plant
              </ModalHeader>
              <ModalBody className="flex flex-col justify-center items-center gap-4">
                <Input
                  label="Plant name"
                  labelPlacement="outside"
                  placeholder="Enter the name of the plant"
                  value={plantName}
                  onValueChange={(value) => setPlantName(value)}
                />
                <Input
                  label="Plant image"
                  labelPlacement="outside"
                  placeholder="Upload the image of the plant"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Tabs
                  fullWidth
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key.toString())}
                >
                  <Tab key="manual" title="Manual" className="w-full">
                    <Input
                      fullWidth
                      label="Time"
                      labelPlacement="outside"
                      placeholder="Enter the time in minutes"
                      value={time}
                      onValueChange={(value) => setTime(value)}
                    />
                  </Tab>
                  <Tab
                    key="auto"
                    className="w-full flex flex-col gap-4"
                    title="Auto"
                  >
                    <Select
                      disallowEmptySelection
                      label="Frequency"
                      labelPlacement="outside"
                      placeholder="Select the frequency"
                      selectedKeys={frequency}
                      onSelectionChange={setFrequency}
                    >
                      <SelectItem key={"days"}>Daily</SelectItem>
                      <SelectItem key={"weeks"}>Weekly</SelectItem>
                      <SelectItem key={"month"}>Monthly</SelectItem>
                    </Select>
                    <Input
                      label="Interval"
                      labelPlacement="outside"
                      placeholder="Enter the interval"
                      value={interval}
                      onValueChange={(value) => setInterval(value)}
                    />
                    <TimeInput
                      label="Time"
                      labelPlacement="outside"
                      value={timeOfDay}
                      onChange={setTimeOfDay}
                    />
                  </Tab>
                </Tabs>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onSavePlant}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete */}
      <Modal
        isOpen={isOpenDelete}
        placement="center"
        onOpenChange={onOpenChangeDelete}
        className="pt-4"
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* <ModalHeader className="flex flex-col gap-1">
                Add a plant
              </ModalHeader> */}
              <ModalBody className="flex flex-col justify-center items-center gap-4">
                <h1>
                  Are you sure you want to delete this plant?
                </h1>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
export default Plants;

"use client";

import Plant, { SimplePlantT } from "@/src/API/plants";
import { useUserContext } from "@/utils/user-context";
import React, { useEffect } from "react";
import PlantItem from "./plant-item";
import { Button } from "@nextui-org/button";
import type { TimeValue } from "@react-types/datepicker";
import {
  parseAbsoluteToLocal,
  Time,
  ZonedDateTime,
} from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
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
import { it } from "node:test";

const list = [
  {
    title: "Orange",
    img: "https://www.businessadvisorynetwork.com/wp-content/uploads/2018/04/orange.jpg",
  },
  {
    title: "Banana",
    img: "https://www.nicheagriculture.com/wp-content/uploads/2023/09/A-Guide-to-Robusta-Banana-Farming-in-India-2-scaled.jpg",
  },
  {
    title: "Raspberry",
    img: "https://cdn.shopify.com/s/files/1/0059/8835/2052/files/Heritage_Raspberry_1_FGT_af269c43-b789-4585-a33c-6a9e5fb52548.jpg?v=1707158456",
  },
  {
    title: "Lemon",
    img: "https://i.pinimg.com/736x/ce/f3/86/cef3866818f132dd320ff6d4c0e85f27.jpg",
  },
  {
    title: "Tangerine",
    img: "https://i0.wp.com/agnetwest.com/wp-content/uploads/2020/12/potted-tangerine-tree-pinterest.jpg?fit=600%2C548&ssl=1",
  },
  {
    title: "Avocado",
    img: "https://i0.wp.com/stmaartenagriculture.com/wp-content/uploads/2020/06/avocado-plant-st-maarten-agriculture-900px.jpg?fit=900%2C1200&ssl=1",
  },
  {
    title: "Lemon 2",
    img: "https://media.istockphoto.com/id/1380361370/photo/decorative-banana-plant-in-concrete-vase-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=eYADMQ9dXTz1mggdfn_exN2gY61aH4fJz1lfMomv6o4=",
  },
  {
    title: "Watermelon",
    img: "https://www.botanicalinterests.com/community/blog/wp-content/uploads/2024/08/watermelon-sow-and-grow-guide.jpg",
  },
  {
    title: "Banana",
    img: "https://media.istockphoto.com/id/1380361370/photo/decorative-banana-plant-in-concrete-vase-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=eYADMQ9dXTz1mggdfn_exN2gY61aH4fJz1lfMomv6o4=",
  },
  {
    title: "Watermelon",
    img: "https://media.istockphoto.com/id/1380361370/photo/decorative-banana-plant-in-concrete-vase-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=eYADMQ9dXTz1mggdfn_exN2gY61aH4fJz1lfMomv6o4=",
  },
  {
    title: "Banana",
    img: "https://media.istockphoto.com/id/1380361370/photo/decorative-banana-plant-in-concrete-vase-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=eYADMQ9dXTz1mggdfn_exN2gY61aH4fJz1lfMomv6o4=",
  },
  {
    title: "Watermelon",
    img: "https://media.istockphoto.com/id/1380361370/photo/decorative-banana-plant-in-concrete-vase-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=eYADMQ9dXTz1mggdfn_exN2gY61aH4fJz1lfMomv6o4=",
  },
  {
    title: "Banana",
    img: "https://media.istockphoto.com/id/1380361370/photo/decorative-banana-plant-in-concrete-vase-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=eYADMQ9dXTz1mggdfn_exN2gY61aH4fJz1lfMomv6o4=",
  },
  {
    title: "Watermelon",
    img: "https://media.istockphoto.com/id/1380361370/photo/decorative-banana-plant-in-concrete-vase-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=eYADMQ9dXTz1mggdfn_exN2gY61aH4fJz1lfMomv6o4=",
  },
];

function Plants() {
  const { user } = useUserContext();
  const [plants, setPlants] = React.useState<SimplePlantT[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [plantName, setPlantName] = React.useState("");
  const [plantImage, setPlantImage] = React.useState("");
  const [soilMoisture, setSoilMoisture] = React.useState("");
  const [time, setTime] = React.useState("");
  const [frequency, setFrequency] = React.useState<Selection>(new Set([]));
  const [interval, setInterval] = React.useState("");
  const [timeOfDay, setTimeOfDay] = React.useState<TimeInputValue>(
    parseAbsoluteToLocal("2024-04-08T18:45:22Z")
  );
  const [selectedTab, setSelectedTab] = React.useState("manual");

  const router = useRouter();

  useEffect(() => {
    Plant.getPlants(user).then((plants) => {
      setPlants(plants);
    });
  }, [user]);

  const onSavePlant = React.useCallback(() => {
    // Save the plant
    console.log("Plant saved");
    if (
      plantName === "" ||
      soilMoisture === "" ||
      time === "" ||
      frequency === "all" ||
      frequency.size === 0 ||
      interval === "" ||
      timeOfDay === null
    ) {
      alert("Please fill all the fields");

      return;
    }

    Plant.addPlant(user, {
      name: plantName,
      image_url: plantImage,
      watering_frequency: {
        interval_type: "days",
        interval_value: parseInt(interval),
        time_of_day: timeOfDay && timeOfDay.toString(),
      },
      mode: selectedTab as "auto" | "manual",
    }).then((plant) => {
      setPlants([...plants, plant]);
      onOpenChange();
    });
  }, [
    plantName,
    soilMoisture,
    time,
    frequency,
    interval,
    timeOfDay,
    plantImage,
    plants,
    onOpenChange,
    selectedTab,
  ]);

  return (
    <div className="overflow-hidden bg-default-100 pb-[100px]">
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
        {list.map((item, index) => (
          <Card
            shadow="sm"
            key={index}
            isPressable
            onPress={() => router.push(`/plants/${item.title}`)}
          >
            <CardBody className="overflow-visible p-0 bg-primary-100">
              <Image
                shadow="sm"
                radius="lg"
                width="100%"
                alt={item.title}
                className="w-full object-cover h-[140px]"
                src={item.img}
              />
            </CardBody>
            <CardFooter className="text-small justify-between bg-primary-100">
              <b>{item.title}</b>
              <p className="text-default-500">{`55%`}</p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add a plant
              </ModalHeader>
              <ModalBody className="flex flex-col justify-center items-center gap-2">
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
                  placeholder="Enter the image URL"
                />
                <Input
                  label="Soil moisture"
                  labelPlacement="outside"
                  placeholder="Enter the soil moisture"
                  value={soilMoisture}
                  onValueChange={(value) => setSoilMoisture(value)}
                />
                <Tabs
                  fullWidth
                  selectedKey={selectedTab}
                  onSelectionChange={(key) => setSelectedTab(key.toString())}
                >
                  <Tab key="manual" title="Manual" className="w-full">
                    <Card shadow="none" fullWidth>
                      <CardBody>
                        <Input
                          fullWidth
                          label="Time"
                          labelPlacement="outside"
                          placeholder="Enter the time in minutes"
                          value={time}
                          onValueChange={(value) => setTime(value)}
                        />
                      </CardBody>
                    </Card>
                  </Tab>
                  <Tab key="auto" title="Auto" className="w-full">
                    <Card shadow="none" fullWidth>
                      <CardBody className="flex flex-col gap-2">
                        <Select
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
                          labelPlacement="outside"
                          label="Time"
                          value={timeOfDay}
                          onChange={setTimeOfDay}
                        />
                      </CardBody>
                    </Card>
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
    </div>
  );
}
export default Plants;

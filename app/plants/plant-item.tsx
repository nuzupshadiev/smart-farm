import { SimplePlantT } from "@/src/API/plants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";

type PlantItemProps = {
  plant: SimplePlantT;
};
function PlantItem({ plant }: PlantItemProps) {
  const router = useRouter();

  return (
    <Card
      className={
        "flex flex-col gap-y-2 border-2 border-transparent hover:border-primary-600 p-1"
      }
      isPressable
      disableRipple
      onPress={() => router.push(`/plants/${plant.plant_id}`)}
      as={"div"}
    >
      <CardBody className=" flex flex-row gap-4 !p-0 ml-1 h-20 bg-primary-100">
        <img
          alt="thumbnail"
          className="object-fit rounded-lg"
          src={plant.image_url}
        />
        <Button isIconOnly>
          <FontAwesomeIcon icon="camera" />
        </Button>
        <div className="flex justify-center items-center">
          <h1 className="font-bold text-xl text-foreground">{plant.name}</h1>
        </div>
      </CardBody>
    </Card>
  );
}
export default PlantItem;

import { Ride } from "../../../../DTO/Ride";
import dayjs from "dayjs";
import { convertSecondsToHoursAndMinutes } from "../../../../utils/convertSecondsToHoursAndMinutes";

interface HistoryCardProps {
  ride: Ride
}

export const HistoryCard = ({ ride }: HistoryCardProps) => {

  return (
    <div
      className={`bg-black text-white p-4 min-h-[300px] md:w-[350px] w-full rounded-md flex flex-col gap-2 cursor-pointer hover:opacity-70 transition-all ease-in-out duration-300 border`}
    >
      <p>
        <strong>Data e hora:</strong>{" "}
        {dayjs(ride.date).format("DD/MM/YYYY HH:mm")}
      </p>
      <p>
        <strong>Motorista:</strong> {ride.driver.name}
      </p>
      <p>
        <strong>Origem:</strong> {ride.origin}
      </p>
      <p>
        <strong>Destino:</strong> {ride.destination}
      </p>
      <p>
        <strong>Distância:</strong> {ride.distance} km
      </p>
      <p>
        <strong>Duração:</strong> {convertSecondsToHoursAndMinutes(Number(ride.duration))}
      </p>
      <p>
        <strong>Valor:</strong> R$ {ride.value.toFixed(2)}
      </p>
    </div>
  )
};

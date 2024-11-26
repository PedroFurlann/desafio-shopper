import { Driver } from "../../../../DTO/Driver";
import HomerAvatar from '../../../../assets/homer-avatar.jpeg'
import TorettoAvatar from '../../../../assets/toretto-avatar.jpg'
import JamesBondAvatar from '../../../../assets/james-bond-avatar.jpg'

interface DriverCardProps {
  driver: Driver;
  isSelected: boolean;
  onClick: () => void;
}

export const DriverCard = ({ driver, isSelected = false, onClick }: DriverCardProps) => {
  const avatarSrc = driver.id === 1
    ? HomerAvatar : driver.id === 2
      ? TorettoAvatar
      : JamesBondAvatar

  return (
    <div
      onClick={onClick}
      className={`bg-gray-900 text-white p-4 rounded-md flex flex-col gap-2 cursor-pointer hover:opacity-70 transition-all ease-in-out duration-300 ${isSelected && "border border-emerald-600"
        }`}
    >

      <img
        src={avatarSrc}
        alt="Driver avatar"
        className={`w-16 h-16 mb-2 self-center rounded-full object-cover ${isSelected && 'border border-emerald-600'}`}
      />
      <p>
        <strong>Motorista:</strong> {driver.name}
      </p>
      <p>
        <strong>Descrição:</strong> {driver.description}
      </p>
      <p>
        <strong>Veículo:</strong> {driver.vehicle}
      </p>
      <p>
        <strong>Avaliação:</strong> {driver.review.rating}/5 ({driver.review.comment})
      </p>
      <p>
        <strong>Preço:</strong> R$ {driver.value.toFixed(2).replace(".", ",")}
      </p>
    </div>
  )
};

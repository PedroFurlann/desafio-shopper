import HomerAvatar from '../../../../assets/homer-avatar.jpeg'
import TorettoAvatar from '../../../../assets/toretto-avatar.jpg'
import JamesBondAvatar from '../../../../assets/james-bond-avatar.jpg'

interface DriverCardProps {
  driverId: number;
  driverName: string;
  isSelected: boolean;
  onClick: () => void;
}

export const MinDriverCard = ({ driverId, driverName, isSelected = false, onClick }: DriverCardProps) => {
  const avatarSrc = driverId === 1
    ? HomerAvatar : driverId === 2
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
      <p className='self-center'>
        <strong>Motorista:</strong> {driverName}
      </p>
    </div>
  )
};

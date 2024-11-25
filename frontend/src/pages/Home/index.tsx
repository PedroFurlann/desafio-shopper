import { Controller, useForm } from "react-hook-form";
import * as yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup";
import Navbar from "../../components/Navbar";
import Logo from '../../assets/shopper-icon.png'
import TextInput from "../../components/Inputs/TextInput";
import Button from "../../components/Button";
import Loader from "../../components/Loader";
import { useState } from "react";

interface FormData {
  customerId: string;
  origin: string;
  destination: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false)

  const validationSchema = yup.object().shape({
    customerId: yup.string().trim().required("Informe o id do usuário"),
    origin: yup.string().trim().required("Informe o endereço de origem"),
    destination: yup.string().trim().required("Informe o endereço de destino").test(
      "different-from-origin",
      "Origem e destino não podem ser iguais",
      function (value) {
        return value !== this.parent.origin;
      }
    ),
  })


  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const handleSignIn = async ({ customerId, origin, destination }: FormData) => {
    setLoading(true)
    console.log(customerId, origin, destination)
  }

  return (
    <>
      <>
        <div className="min-h-screen flex flex-col bg-gray-900 overflow-y-auto">
          <Navbar />
          <div className="flex rounded-md flex-col items-center justify-center flex-grow md:flex-row">
            {loading ? (
              <Loader />
            ) : (
              <div className="flex flex-col gap-4 items-center justify-center p-8 md:w-96 bg-black rounded-md border-gray-800">
                <img alt="Shopper logo" src={Logo} className="w-12 h-12 bg-transparent" />
                <p className="text-xl text-gray-200 font-bold">Solicitação de viagem</p>
                <Controller
                  control={control}
                  name="customerId"
                  render={({ field }) => (
                    <TextInput
                      placeholder="Id do usuário"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.customerId && (
                  <p className="text-red-500 text-sm font-bold self-start mt-[-12px]">
                    {errors.customerId.message}
                  </p>
                )}
                <Controller
                  control={control}
                  name="origin"
                  render={({ field }) => (
                    <TextInput
                      placeholder="Endereço de origem"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.origin && (
                  <p className="text-red-500 text-sm font-bold self-start mt-[-12px]">
                    {errors.origin.message}
                  </p>
                )}

                <Controller
                  control={control}
                  name="destination"
                  render={({ field }) => (
                    <TextInput
                      placeholder="Endereço de destino"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />

                {errors.destination && (
                  <p className="text-red-500 text-sm font-bold self-start mt-[-12px]">
                    {errors.destination.message}
                  </p>
                )}

                <Button
                  label="Estimar"
                  onClick={handleSubmit(handleSignIn)}
                  size="medium"
                />
              </div>
            )}
          </div>
        </div>

      </>
    </>
  );
}
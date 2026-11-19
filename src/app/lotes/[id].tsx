import { useLocalSearchParams } from "expo-router";

import { FormularioLoteScreen } from "@/modules/lotes/presentation/screens/FormularioLoteScreen";

export default function EditarLote() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FormularioLoteScreen id={id} />;
}

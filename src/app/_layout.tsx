import { Stack } from "expo-router";

import { colores } from "@/shared/theme/colores";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colores.primario },
        headerTintColor: colores.sobrePrimario,
      }}
    >
      <Stack.Screen name="index" options={{ title: "TruchaConecta · Lotes" }} />
      <Stack.Screen name="lotes/nuevo" options={{ title: "Registrar lote" }} />
      <Stack.Screen name="lotes/[id]" options={{ title: "Editar lote" }} />
    </Stack>
  );
}

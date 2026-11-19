import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Boton } from "@/shared/components/Boton";
import { colores } from "@/shared/theme/colores";

import type { Lote } from "../../domain/entities/Lote";
import { LoteCard } from "../components/LoteCard";
import { useLotes } from "../hooks/useLotes";

export function ListaLotesScreen() {
  const router = useRouter();
  const { lotes, cargando, refrescando, error, refrescar, eliminar } = useLotes();

  function confirmarEliminar(lote: Lote) {
    Alert.alert(
      "Eliminar lote",
      `¿Eliminar el lote "${lote.codigo}"? No se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const eliminado = await eliminar(lote.id);
            if (!eliminado) Alert.alert("Error", "No se pudo eliminar el lote.");
          },
        },
      ],
    );
  }

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centro}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={lotes}
        keyExtractor={(lote) => lote.id}
        renderItem={({ item }) => (
          <LoteCard
            lote={item}
            onEditar={() =>
              router.push({ pathname: "/lotes/[id]", params: { id: item.id } })
            }
            onEliminar={() => confirmarEliminar(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        ListEmptyComponent={
          <Text style={styles.vacio}>Aún no hay lotes registrados.</Text>
        }
        contentContainerStyle={styles.lista}
        refreshing={refrescando}
        onRefresh={refrescar}
      />
      <View style={styles.pie}>
        <Boton titulo="Registrar lote" onPress={() => router.push("/lotes/nuevo")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  centro: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  lista: { padding: 16 },
  separador: { height: 12 },
  vacio: { textAlign: "center", color: colores.textoSuave, marginTop: 32 },
  error: { color: colores.error, fontSize: 16, textAlign: "center" },
  pie: { padding: 16 },
});

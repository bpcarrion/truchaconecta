import { Pressable, StyleSheet, Text, View } from "react-native";

import { colores } from "@/shared/theme/colores";

import type { Lote } from "../../domain/entities/Lote";

type Props = {
  lote: Lote;
  onEditar: () => void;
  onEliminar: () => void;
};

export function LoteCard({ lote, onEditar, onEliminar }: Props) {
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.categoria}>{lote.origen}</Text>
      <Text style={styles.nombre}>{lote.codigo}</Text>
      <Text style={styles.ubicacion}>{lote.producto}</Text>
      <Text style={styles.descripcion}>
        {Number(lote.cantidad).toLocaleString("es")} ovas · llegada: {lote.llegada}
      </Text>
      <View style={styles.acciones}>
        <Pressable onPress={onEditar} accessibilityRole="button">
          <Text style={styles.accion}>Editar</Text>
        </Pressable>
        <Pressable onPress={onEliminar} accessibilityRole="button">
          <Text style={[styles.accion, styles.peligro]}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: 16,
    gap: 4,
  },
  categoria: {
    fontSize: 12,
    fontWeight: "700",
    color: colores.primario,
    textTransform: "uppercase",
  },
  nombre: { fontSize: 18, fontWeight: "700", color: colores.texto },
  ubicacion: { fontSize: 14, color: colores.textoSuave },
  descripcion: { fontSize: 15, color: colores.texto, marginTop: 4 },
  acciones: { flexDirection: "row", gap: 24, marginTop: 12 },
  accion: { fontSize: 15, fontWeight: "700", color: colores.primario },
  peligro: { color: colores.error },
});

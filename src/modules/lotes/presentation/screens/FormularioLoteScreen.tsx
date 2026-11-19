import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { Boton } from "@/shared/components/Boton";
import { CampoTexto } from "@/shared/components/CampoTexto";
import { colores } from "@/shared/theme/colores";

import { useFormularioLote } from "../hooks/useFormularioLote";

type Props = {
  id?: string;
};

export function FormularioLoteScreen({ id }: Props) {
  const { datos, errores, errorGeneral, cargando, guardando, cambiar, guardar } =
    useFormularioLote(id);

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      keyboardShouldPersistTaps="handled"
    >
      <CampoTexto
        etiqueta="Código del lote"
        value={datos.codigo}
        onChangeText={(texto) => cambiar("codigo", texto)}
        error={errores.codigo}
        placeholder="LOTE-ESP-001"
        autoCapitalize="characters"
      />
      <CampoTexto
        etiqueta="Producto"
        value={datos.producto}
        onChangeText={(texto) => cambiar("producto", texto)}
        error={errores.producto}
        placeholder="Ova embrionada de trucha arcoíris"
      />
      <CampoTexto
        etiqueta="Origen"
        value={datos.origen}
        onChangeText={(texto) => cambiar("origen", texto)}
        error={errores.origen}
        placeholder="España"
      />
      <CampoTexto
        etiqueta="Cantidad de ovas"
        value={datos.cantidad}
        onChangeText={(texto) => cambiar("cantidad", texto)}
        error={errores.cantidad}
        placeholder="200000"
        keyboardType="number-pad"
      />
      <CampoTexto
        etiqueta="Llegada estimada"
        value={datos.llegada}
        onChangeText={(texto) => cambiar("llegada", texto)}
        error={errores.llegada}
        placeholder="2026-12-15"
      />

      {errorGeneral ? <Text style={styles.errorGeneral}>{errorGeneral}</Text> : null}

      <Boton
        titulo={id === undefined ? "Guardar lote" : "Guardar cambios"}
        onPress={guardar}
        cargando={guardando}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  centro: { flex: 1, alignItems: "center", justifyContent: "center" },
  contenido: { padding: 16, gap: 16 },
  errorGeneral: { color: colores.error, fontSize: 14 },
});

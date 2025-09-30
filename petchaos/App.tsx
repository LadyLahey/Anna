import React, { useMemo, useState } from "react";
import { View, Text, Image, StyleSheet, Button, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";

/** ---- Types ---- */
type Pet = {
  id: string;
  name: string;
  species: "Cat" | "Dog" | "Bird" | "Lizard" | "Blob";
  stage: number;
  traits: string[];
  image: string; // url for now (placeholder)
  hunger: number; // 0 = full, 100 = starving
  happiness: number; // 0–100
};

type RootStackParamList = {
  Hatch: undefined;
  PetProfile: { pet: Pet };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/** ---- Utility: make a random starter pet ---- */
function hatchRandomPet(): Pet {
  const species = ["Cat", "Dog", "Bird", "Lizard", "Blob"] as const;
  const traitsPool = ["vibey", "drippy", "cursed", "sparkly", "gremlin", "cozy"];
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];
  const sampleTraits = () => {
    const t = new Set<string>();
    while (t.size < 3) t.add(pick(traitsPool));
    return [...t];
  };

  return {
    id: String(Date.now()),
    name: pick(["Fluffy", "Chaosling", "Skittle", "Orbit", "Mochi"]),
    species: pick(species),
    stage: 1,
    traits: sampleTraits(),
    image: "https://placekitten.com/300/300", // placeholder img
    hunger: 40,
    happiness: 60,
  };
}

/** ---- Screens ---- */
type HatchProps = NativeStackScreenProps<RootStackParamList, "Hatch">;
function HatchScreen({ navigation }: HatchProps) {
  const handleHatch = () => {
    const newPet = hatchRandomPet();
    navigation.replace("PetProfile", { pet: newPet });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.appTitle}>PetChaos</Text>
        <Text style={styles.h1}>🥚 Hatch Your Chaos</Text>
        <Text style={styles.subtle}>Tap the button to begin your pet’s unpredictable journey.</Text>
        <View style={{ height: 16 }} />
        <Button title="Hatch" onPress={handleHatch} />
      </View>
    </SafeAreaView>
  );
}

type PetProps = NativeStackScreenProps<RootStackParamList, "PetProfile">;
function PetProfileScreen({ route }: PetProps) {
  const [pet, setPet] = useState<Pet>(route.params.pet);

  const feed = () =>
    setPet(p => ({ ...p, hunger: Math.max(0, p.hunger - 15) }));
  const play = () =>
    setPet(p => ({ ...p, happiness: Math.min(100, p.happiness + 12), hunger: Math.min(100, p.hunger + 5) }));

  const mood = useMemo(() => {
    if (pet.hunger > 70) return "Hangry";
    if (pet.happiness > 75) return "Vibing";
    if (pet.happiness < 30) return "Grumpy";
    return "Chill";
  }, [pet.hunger, pet.happiness]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.h1}>{pet.name} • {pet.species}</Text>
      <Image source={{ uri: pet.image }} style={styles.petImage} />
      <Text style={styles.line}>Stage: {pet.stage}</Text>
      <Text style={styles.line}>Traits: {pet.traits.join(", ")}</Text>
      <Text style={styles.line}>Hunger: {pet.hunger}</Text>
      <Text style={styles.line}>Happiness: {pet.happiness}</Text>
      <Text style={styles.badge}>Mood: {mood}</Text>

      <View style={{ height: 12 }} />
      <Button title="Feed 🍖" onPress={feed} />
      <View style={{ height: 8 }} />
      <Button title="Play 🎮" onPress={play} />
    </SafeAreaView>
  );
}

/** ---- App Root ---- */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitle: "PetChaos" }}>
        <Stack.Screen name="Hatch" component={HatchScreen} options={{ title: "Hatch" }} />
        <Stack.Screen name="PetProfile" component={PetProfileScreen} options={{ title: "Your Pet" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/** ---- Styles ---- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1115",
    padding: 16,
  },
  appTitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 20,
  },
  h1: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtle: { color: "#b6beca", textAlign: "center" },
  line: { color: "#d9e1ec", marginTop: 6, textAlign: "center" },
  badge: {
    alignSelf: "center",
    color: "#fff",
    backgroundColor: "#6c5ce7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  petImage: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignSelf: "center",
    marginVertical: 16,
  },
});

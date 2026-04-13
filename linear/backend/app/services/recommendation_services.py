def generate_recommendation(mood, energy, stress, fitness_level):

    if energy <= 2 or stress >= 4:
        return "yoga"

    if fitness_level == "beginner":
        return "light cardio"

    if fitness_level == "intermediate":
        return "moderate workout"

    return "strength training"
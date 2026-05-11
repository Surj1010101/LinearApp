def generate_recommendation(mood, energy, stress, fitness_level, screen_time=None):

    # Heavy digital fatigue overrides fitness level — recommend a screen-free reset.
    if screen_time is not None and screen_time >= 8 and (energy <= 3 or stress >= 3):
        return "yoga"

    if energy <= 2 or stress >= 4:
        return "yoga"

    if fitness_level == "beginner":
        return "light cardio"

    if fitness_level == "intermediate":
        return "moderate workout"

    return "strength training"

import os
import pandas as pd
import random

def calculate_nutrition_score(work_hours, breaks_taken, sleep_hours):
    """
    Assumptions:
    More breaks taken: Time to eat properly
    Work hours: More extreme hours less time to eat properly
    Sleep hours: Less sleeps means unhealthy habits and worse nutrition
    """

    weights ={
        "work_hours": 0.30,
        "breaks_taken": 0.40,
        "sleep_hours": 0.30,
    }

    optimal ={
        "work_hours": 8,
        "breaks_taken": 3,
        "sleep_hours": 7,
    }

    max_deviation = {
        "work_hours": 6,
        "breaks_taken": 3,
        "sleep_hours": 3,
    }

    work_diff = work_hours - optimal["work_hours"]
    if work_diff > 0:
        work_score = 1 - (work_diff / max_deviation["work_hours"])
    else:
        work_score = 1.0
    work_score = max(-1, min(1, work_score))

    breaks_taken_diff = breaks_taken - optimal["breaks_taken"]
    if breaks_taken_diff >= 0:
        breaks_taken_score = 1.0
    else:
        breaks_taken_score = 1 - (abs(breaks_taken_diff) / max_deviation["breaks_taken"])

    breaks_taken_score = max(-1, min(1, breaks_taken_score))

    sleep_hours_diff = sleep_hours - optimal["sleep_hours"]
    if sleep_hours_diff >= 0:
        sleep_hours_score = 1.0
    else:
        sleep_hours_score = 1 - (abs(sleep_hours_diff) / max_deviation["sleep_hours"])
    sleep_hours_score = max(-1, min(1, sleep_hours_score))

    score = (
        work_score * weights["work_hours"]
        + breaks_taken_score * weights["breaks_taken"]
        + sleep_hours_score * weights["sleep_hours"]
    )

    score = (score * 2) - 1

    #Generate noise for randomness
    noise = random.uniform(-0.05, 0.05)
    score += noise

    #Keeping score between -1.0 and 1.0
    final_score = max(-1.0, min(1.0, score))
    return round(final_score, 2)

def calculate_activity_score(work_hours, breaks_taken, sleep_hours, screen_time_hours):
    """
    Assumptions:
    More screen time: Less movement
    More breaks: More opportunity for activities
    More work hours: Less time for activities
    More sleep hours: More energy for activities
    """

    weights = {
        "work_hours": 0.20,
        "breaks_taken": 0.25,
        "sleep_hours": 0.20,
        "screen_time_hours": 0.35
    }

    optimal = {
        "work_hours": 7,
        "breaks_taken": 4,
        "sleep_hours": 8,
        "screen_time_hours": 4
    }

    max_deviation = {
        "work_hours": 6,
        "breaks_taken": 4,
        "sleep_hours": 3,
        "screen_time_hours": 8
    }

    screen_diff = screen_time_hours - optimal["screen_time_hours"]
    if screen_diff >= 0:
        screen_time_hours_score = 1 - (screen_diff / max_deviation["screen_time_hours"])
    else:
        screen_time_hours_score = 1.0
    screen_time_hours_score = max(-1, min(1, screen_time_hours_score))

    breaks_taken_diff = breaks_taken - optimal["breaks_taken"]
    if breaks_taken_diff >= 0:
        breaks_taken_score = 1.0
    else:
        breaks_taken_score = 1 - (abs(breaks_taken_diff) / max_deviation["breaks_taken"])
    breaks_taken_score = max(-1, min(1, breaks_taken_score))

    work_diff = work_hours - optimal["work_hours"]
    if work_diff > 0:
        work_score = 1 - (work_diff / max_deviation["work_hours"])
    else:
        work_score = 1.0
    work_score = max(-1, min(1, work_score))

    sleep_hours_diff = sleep_hours - optimal["sleep_hours"]
    if sleep_hours_diff > 0:
        sleep_hours_score = 1.0
    else:
        sleep_hours_score = 1 - (abs(sleep_hours_diff) / max_deviation["sleep_hours"])
    sleep_hours_score = max(-1, min(1, sleep_hours_score))

    score = (
        screen_time_hours_score * weights["screen_time_hours"]
        + breaks_taken_score * weights["breaks_taken"]
        + sleep_hours_score * weights["sleep_hours"]
        + work_score * weights["work_hours"]
    )

    score = (score * 2) - 1

    noise = random.uniform(-0.05, 0.05)
    score += noise

    final_score = max(-1.0, min(1.0, score))
    return round(final_score, 2)

def calculate_productivity_score(task_completion_rate, work_hours, meetings_count, breaks_taken, sleep_hours):
    """
    Assumptions:
    Task completion rate: Higher means more productive
    Work hours: Too many means more burnout so less productive, too few means not enough time to be productive
    Meeting count: Too many means less time to focus
    Sleep hours: More means better focus
    """
    weights = {
        "task_completion_rate": 0.40,
        "work_hours": 0.20,
        "sleep_hours": 0.20,
        "breaks_taken": 0.10,
        "meetings_count": 0.10,
    }

    optimal ={
        "task_completion_rate": 100,
        "work_hours": 8,
        "sleep_hours": 7,
        "breaks_taken": 3,
        "meetings_count": 2,
    }

    max_deviation = {
        "task_completion_rate": 100,
        "work_hours": 4,
        "sleep_hours": 3,
        "breaks_taken": 2,
        "meetings_count": 6,
    }

    task_diff = task_completion_rate - optimal["task_completion_rate"]
    if task_diff >= 0:
        task_completion_score = 1.0
    else:
        task_completion_score = 1 - (abs(task_diff) / max_deviation["task_completion_rate"])
    task_completion_score = max(-1, min(1, task_completion_score))

    work_diff = abs(work_hours - optimal["work_hours"])
    work_score = 1- (abs(work_diff) / max_deviation["work_hours"])
    work_score = max(-1, min(1, work_score))

    meetings_diff = meetings_count - optimal["meetings_count"]
    if meetings_diff >= 0:
        meetings_count_score = 1 - (meetings_diff / max_deviation["meetings_count"])
    else:
        meetings_count_score = 1.0
    meetings_count_score = max(-1, min(1, meetings_count_score))

    breaks_taken_diff = breaks_taken - optimal["breaks_taken"]
    if breaks_taken_diff >= 0:
        breaks_taken_score = 1.0
    else:
        breaks_taken_score = 1 - (abs(breaks_taken_diff) / max_deviation["breaks_taken"])
    breaks_taken_score = max(-1, min(1, breaks_taken_score))

    sleep_hours_diff = sleep_hours - optimal["sleep_hours"]
    if sleep_hours_diff >= 0:
        sleep_hours_score = 1.0
    else:
        sleep_hours_score = 1 - (abs(sleep_hours_diff) / max_deviation["sleep_hours"])
    sleep_hours_score = max(-1, min(1, sleep_hours_score))

    score = (
        task_completion_score * weights["task_completion_rate"]
        + work_score * weights["work_hours"]
        + meetings_count_score * weights["meetings_count"]
        + breaks_taken_score * weights["breaks_taken"]
        + sleep_hours_score * weights["sleep_hours"]

    )

    score = (score * 2) - 1
    noise = random.uniform(-0.05, 0.05)
    score += noise
    final_score = max(-1.0, min(1.0, score))
    return round(final_score, 2)

def calculate_stress_score(work_hours, meetings_count, after_hours_work, breaks_taken, sleep_hours, screen_time_hours):
    """
    Assumptions:
    Work Hours: more work means more stress
    Meeting count: More meetings increases stress
    After Hours: extra work and working late leads to higher stress
    Breaks Taken: More breaks decreases stress
    Sleep hours: Less sleep hours increases stress
    Screen time: More screens increases stress

    """
    weights = {
        "work_hours": 0.20,
        "meetings_count": 0.15,
        "after_hours_work": 0.20,
        "breaks_taken": 0.15,
        "sleep_hours": 0.15,
        "screen_time_hours": 0.15,

    }

    optimal ={
        "work_hours": 7,
        "meetings_count": 2,
        "after_hours_work": 0,
        "breaks_taken": 4,
        "sleep_hours": 8,
        "screen_time_hours": 4,
    }

    max_deviation = {
        "work_hours": 6,
        "meetings_count": 6,
        "after_hours_work": 4,
        "breaks_taken": 4,
        "sleep_hours": 4,
        "screen_time_hours": 8,
    }

    work_diff = work_hours - optimal["work_hours"]
    if work_diff > 0:
        work_hours_score = 1 - (work_diff / max_deviation["work_hours"])
    else:
        work_hours_score = 1.0
    work_hours_score = max(-1, min(1, work_hours_score))

    meetings_diff = meetings_count - optimal["meetings_count"]
    if meetings_diff > 0:
        meetings_count_score = 1 - (meetings_diff / max_deviation["meetings_count"])
    else:
        meetings_count_score = 1.0
    meetings_count_score = max(-1, min(1, meetings_count_score))

    after_hours_diff = after_hours_work - optimal["after_hours_work"]
    if after_hours_diff > 0:
        after_hours_score = 1 - (after_hours_diff / max_deviation["after_hours_work"])
    else:
        after_hours_score = 1.0
    after_hours_score = max(-1, min(1, after_hours_score))

    breaks_taken_diff = breaks_taken - optimal["breaks_taken"]
    if breaks_taken_diff >= 0:
        breaks_taken_score = 1.0
    else:
        breaks_taken_score = 1 - (abs(breaks_taken_diff) / max_deviation["breaks_taken"])
    breaks_taken_score = max(-1, min(1, breaks_taken_score))

    sleep_hours_diff = sleep_hours - optimal["sleep_hours"]
    if sleep_hours_diff >= 0:
        sleep_hours_score = 1.0
    else:
        sleep_hours_score = 1 - (abs(sleep_hours_diff) / max_deviation["sleep_hours"])
    sleep_hours_score = max(-1, min(1, sleep_hours_score))

    screen_time_hours_diff = screen_time_hours - optimal["screen_time_hours"]
    if screen_time_hours_diff > 0:
        screen_time_hours_score = 1 - (screen_time_hours_diff / max_deviation["screen_time_hours"])
    else:
        screen_time_hours_score = 1.0
    screen_time_hours_score = max(-1, min(1, screen_time_hours_score))

    score = (
        work_hours_score * weights["work_hours"]
        + meetings_count_score * weights["meetings_count"]
        + breaks_taken_score * weights["breaks_taken"]
        + sleep_hours_score * weights["sleep_hours"]
        + screen_time_hours_score * weights["screen_time_hours"]
        + after_hours_score * weights["after_hours_work"]
    )

    score = (score * 2) - 1
    noise = random.uniform(-0.05, 0.05)
    score += noise

    final_score = max(-1.0, min(1.0, score))
    return round(final_score, 2)

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))

    #Loading existing burnout dataset
    filepath = os.path.join(base_dir, "..", "Dataset", "work_from_home_burnout_dataset.csv")
    data = pd.read_csv(filepath)
    data = data.dropna()

    nutrition_scores = []
    activity_scores = []
    productivity_scores = []
    stress_scores = []

    for index, row in data.iterrows():
        nutrition_score = calculate_nutrition_score(
            row["work_hours"],
            row["breaks_taken"],
            row["sleep_hours"]
        )
        activity_score = calculate_activity_score(
            row["work_hours"],
            row["breaks_taken"],
            row["sleep_hours"],
            row["screen_time_hours"]
        )
        productivity_score = calculate_productivity_score(
            row["task_completion_rate"],
            row["work_hours"],
            row["meetings_count"],
            row["breaks_taken"],
            row["sleep_hours"],
        )
        stress_score = calculate_stress_score(
            row["work_hours"],
            row["meetings_count"],
            row["after_hours_work"],
            row["breaks_taken"],
            row["sleep_hours"],
            row["screen_time_hours"],
        )

        nutrition_scores.append(nutrition_score)
        activity_scores.append(activity_score)
        productivity_scores.append(productivity_score)
        stress_scores.append(stress_score)

    data['nutrition_score'] = nutrition_scores
    data['activity_score'] = activity_scores
    data['productivity_score'] = productivity_scores
    data['stress_score'] = stress_scores
    filepath = os.path.join(base_dir, "..", "Dataset", "upgraded_wfh_dataset.csv")
    data.to_csv(filepath, index=False)
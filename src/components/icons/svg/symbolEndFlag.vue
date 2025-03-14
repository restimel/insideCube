<template>
<symbol
    id="endFlag"
    class="icon"
    viewBox="0 0 170 250"
>
    <!-- stick -->
    <path
        d="M0,0 L10,0 30,244 20,245"
    />

    <!-- flag -->
    <path
        d="M10,0
        Q30,10 50,5
        Q70,0 90,10
        Q110,20 130,15
        Q150,10 170,20
        L170,140
        Q150,130 130,135
        Q110,140 90,130
        Q70,120 50,125
        Q30,130 10,120 Z"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
    />

    <!-- Pattern -->
    <!-- 1st row -->
    <path d="M10,0 Q30,10 50,5 L50,33 Q30,38 10,28 Z"/>
    <path d="M50,5 Q70,0 90,10 L90,38 Q70,28 50,33 Z" fill="transparent"/>
    <path d="M90,10 Q110,20 130,15 L130,43 Q110,48 90,38 Z"/>
    <path d="M130,15 Q150,10 170,20 L170,48 Q150,38 130,43 Z" fill="transparent"/>

    <!-- 2nd row -->
    <path d="M10,28 Q30,38 50,33 L50,61 Q30,66 10,56 Z" fill="transparent"/>
    <path d="M50,33 Q70,28 90,38 L90,66 Q70,56 50,61 Z"/>
    <path d="M90,38 Q110,48 130,43 L130,71 Q110,76 90,66 Z" fill="transparent"/>
    <path d="M130,43 Q150,38 170,48 L170,76 Q150,66 130,71 Z"/>

    <!-- 3rd row -->
    <path d="M10,56 Q30,66 50,61 L50,89 Q30,94 10,84 Z"/>
    <path d="M50,61 Q70,56 90,66 L90,94 Q70,84 50,89 Z" fill="transparent"/>
    <path d="M90,66 Q110,76 130,71 L130,99 Q110,104 90,94 Z"/>
    <path d="M130,71 Q150,66 170,76 L170,104 Q150,94 130,99 Z" fill="transparent"/>

    <!-- 4th row -->
    <path d="M10,84 Q30,94 50,89 L50,117 Q30,122 10,112 Z" fill="transparent"/>
    <path d="M50,89 Q70,84 90,94 L90,122 Q70,112 50,117 Z"/>
    <path d="M90,94 Q110,104 130,99 L130,127 Q110,132 90,122 Z" fill="transparent"/>
    <path d="M130,99 Q150,94 170,104 L170,132 Q150,122 130,127 Z"/>

    <!-- 5th row -->
    <path d="M10,112 Q30,122 50,117 L50,125 Q30,130 10,120 Z"/>
    <path d="M50,117 Q70,112 90,122 L90,130 Q70,120 50,125 Z" fill="transparent"/>
    <path d="M90,122 Q110,132 130,127 L130,135 Q110,140 90,130 Z"/>
    <path d="M130,127 Q150,122 170,132 L170,140 Q150,130 130,135 Z" fill="transparent"/>
</symbol>
</template>

<style scoped>
.icon {
    fill: var(--icon-color, currentColor);
    stroke: none;
}
.icon-stroke {
    stroke: var(--iconColor, currentColor);
    fill: none;
    stroke-width: 5;
}
</style>

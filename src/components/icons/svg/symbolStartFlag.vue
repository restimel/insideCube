<template>
<symbol
    id="startFlag"
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
        Q50,10 60,25
        Q70,70 150,25
        Q100,130 15,152 Z"
        class="icon-stroke"
    />

    <path
        d="M10,0
        Q50,10 60,25
        Q70,70 150,25
        Q100,130 25,150 Z"
    />
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

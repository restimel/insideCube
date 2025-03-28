# Roadmap

## TODO (for V1)

Objective: have same features as InsideWeCube

* [ ] Welcome page
* [ ] global
    * [ ] filter on own cubes only
    * [ ] manage the collection (cube deletion)
    * [ ] save active cube
    * [ ] add Default brand cubes
        * [ ] add brand newer cubes
* [x] Import/Export
    * [x] can import InsideWeCube json format
    * [x] can import InsideCube json format
    * [x] can export InsideCube json format
    * [x] can select which cube to export
    * [x] remove the cube selection (no more needed)
* [ ] Manage
    * [x] load cube
    * [x] reset cube
    * [x] change cube name
    * [x] change cube color
    * [x] change cube size (and level size)
    * [x] save cube to collection
    * [ ] Edit cells
        * [x] wall (left/down)
        * [x] hole
        * [x] start/stop
        * [ ] pins
        * [ ] phantom
        * [ ] stairs _(new feature)_
    * [x] level name
    * [ ] level comment
    * [ ] load level
    * [ ] Statistics
        * [ ] difficulty estimation
        * [ ] different properties
            * [ ] _to list..._
        * [ ] Worker to build these statistics
        * [ ] Highlight available cells
    * [ ] Map preview
        * [x] basis
        * [ ] change orientation
        * [ ] print mode
* [ ] Lost
    * [ ] select the cube
    * [ ] Find the ball
        * [ ] Map selection / show possibilities
        * [ ] Instructions
        * [ ] Worker to propose instructions
    * [ ] Solution
        * [ ] reverse option
        * [ ] short instruction
        * [ ] long instruction
            * [ ] small preview
            * [ ] move (with animation?)
* [ ] Help/FAQ
* [ ] Build new cubes _(Not expected for v1)_

## Expected improvements

* [ ] Global
    * [ ] modal: support key board (escape/enter)
    * [ ] improve mobile support / design
    * [ ] improve large screen
* [ ] Import/Export
    * Improve format compression (code for cells (single letter))
* [ ] Manage
    * [ ] History
        * [ ] handle keyboard (ctrl+z / ctrl + y)
* [ ] Lost
    * auto detect with sound / mobile orientation
* [ ] Play
    * list cubes
    * display ball in maze
    * move ball depending on orientation
    * vibration to simulate ball moves

## known bugs

* [x] store
    * [x] history should be handled by store
    * [ ] Do not save non-named cube
    * [ ] Do not overwrite default cube
* [ ] History
    * [ ] there should be a first log to come back as initial
    * [x] translation are not updated → store key and details
    * [ ] translation are not updated (tool name, property name)
    * [ ] title does not appear on SVG

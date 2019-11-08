const Toggle = ({id, name, value}) =>

<div class="onoffswitch">
    <input type="checkbox" name={name} class="toggle-checkbox" id={`toggle-${id}-${name}`} checked={value}>
    <label class="toggle-label" for={`toggle-${id}-${name}`}></label>
</div>

## Quick start
	
### JavaScript
    
    $('.option-filter').optionFilter();
	
### Example mark-up

    <div class="option-filter">

        <select class="option-filter-select" name="Country" data-option-filter-id="0">
          <option class="option-filter-placeholder" value="">Select a Country</option>
          <option value="United Kingdom">United Kingdom</option>
          <option value="United States">United States</option>
        </select>

        <select class="option-filter-select" name="State" data-option-filter-id="1">
          <option class="option-filter-placeholder" value="">Select a State/County</option>
          <option class="United-States" value="New York">New York</option>
          <option class="United-States" value="New Jersey">New Jersey</option>
          <option class="United-States" value="Arizona">Arizona</option>
          <option class="United-Kingdom" value="Greater London">Greater London</option>
          <option class="United-Kingdom" value="Essex">Essex</option>           
        </select>

        <select class="option-filter-select" name="City" data-option-filter-id="2">
          <option class="option-filter-placeholder" value="">Select a City/Town</option>
          <option class="United-States New-York" selected="selected" value="New York">New York City</option>
          <option class="United-States Arizona" value="Tuscon">Tuscon</option>
          <option class="United-States Arizona" value="Phoenix">Phoenix</option>
          <option class="United-States New-Jersey" value="Guido Beach">Guido Beach?</option>
          <option class="United-Kingdom Essex" value="Rayleigh">Rayleigh</option>
          <option class="United-Kingdom Essex" value="Southend On Sea">Southend On Sea</option>
          <option class="United-Kingdom Greater-London" value="Mayfair">Mayfair</option>
          <option class="United-Kingdom Greater-London" value="Herne Hill">Herne Hill</option>
        </select>
      
    </div>

## DOCS

### Overview
This plugin removes options from a select list (rather than hide with CSS) based on the selection of an option item.

A relationship must be defined for each option through the use of multiple classes. Each class must match a value of another select list option (where hyphens can be used to replace spaces in the matching class name) and be in sequence.

For example: "Mayfair" in Select list "City" is related to "United Kingdom" and "Greater London" so uses the classes: "United-Kingdom Greater-London" in this specific order.

### Options
#### name: 'option-filter' (string)
Defines the name of the plugin in order to change class names used in markup.

### Callbacks

#### Data returned to callbacks

    {
        objects: {
            selectLists (jQuery object), /* All the select lists */
            mainArray (array object), /* The raw array of the select lists */
        },
        selectName: string - /* Name of select list currently being replaced */
    }

#### beforeChange: null (function)
Callback function to do something before the options are replaced.

#### afterChange: null (function)
Callback function to do something after the options are replaced.
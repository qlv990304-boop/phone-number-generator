// Read-only browser-console expression. No edits, submissions or validity events.
JSON.stringify(Array.from(document.querySelectorAll('input[data-case]'), i => ({
 id:i.id,case:i.dataset.case,policy:i.dataset.policy,value:i.value,
 willValidate:i.willValidate,valid:i.validity.valid,valueMissing:i.validity.valueMissing,
 patternMismatch:i.validity.patternMismatch,typeMismatch:i.validity.typeMismatch
})),null,2)

import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
from nbconvert.preprocessors import CellExecutionError
import sys
# Path to the notebook
# source_notebook_path = "C:\\scripts\\notebooks\\sample.ipynb"
# executed_notebook_path = "C:\\scripts\\notebooks\\ExecutedNotebook.ipynb"
source_notebook_path = sys.argv[1]
executed_notebook_path = sys.argv[2]
# Load the notebook
with open(source_notebook_path, "r", encoding="utf-8") as f:
    nb = nbformat.read(f, as_version=4)

# Setup the Preprocessor
ep = ExecutePreprocessor(timeout=600, kernel_name='python3')

# Execute the notebook
try:
    ep.preprocess(nb, {'metadata': {'path': 'C:\\scripts\\notebooks\\'}})
except CellExecutionError as e:
    msg = 'Error executing the notebook "%s".\n\n' % source_notebook_path
    print(msg)
    raise e

# Save the executed notebook
with open(executed_notebook_path, "w", encoding="utf-8") as f:
    nbformat.write(nb, f)

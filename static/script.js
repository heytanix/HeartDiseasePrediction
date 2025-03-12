document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressBar = document.getElementById('progressBar');
    const uploadStatus = document.getElementById('uploadStatus');
    const detailsToggle = document.getElementById('detailsToggle');
    const detailsContent = document.getElementById('detailsContent');
    
    // Chart object
    let predictionChart = null;
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false);
    
    // Handle file input change
    fileInput.addEventListener('change', handleFiles);
    
    // Handle upload button click
    uploadBtn.addEventListener('click', uploadFile);
    
    // Click on drop area to trigger file input
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Toggle details section
    detailsToggle.addEventListener('click', () => {
        if (detailsContent.style.display === 'none') {
            detailsContent.style.display = 'block';
            detailsToggle.innerText = 'Hide Details';
        } else {
            detailsContent.style.display = 'none';
            detailsToggle.innerText = 'Show Details';
        }
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight() {
        dropArea.classList.add('dragover');
    }
    
    function unhighlight() {
        dropArea.classList.remove('dragover');
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    function handleFiles(e) {
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target && e.target.files) {
            files = e.target.files;
        } else {
            files = e;
        }
        
        if (files.length > 0) {
            const file = files[0];
            
            // Check if file is CSV
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                fileInfo.innerHTML = `
                    <p><strong>File:</strong> ${file.name}</p>
                    <p><strong>Size:</strong> ${formatFileSize(file.size)}</p>
                `;
                uploadBtn.disabled = false;
                uploadBtn.file = file;
            } else {
                fileInfo.innerHTML = `<p class="error">Please select a CSV file</p>`;
                uploadBtn.disabled = true;
            }
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }
    
    function uploadFile() {
        const file = uploadBtn.file;
        if (!file) return;
        
        const formData = new FormData();
        formData.append('file', file);
        
        // Show progress bar
        uploadProgress.style.display = 'block';
        uploadBtn.disabled = true;
        uploadStatus.innerHTML = 'Analyzing...';
        uploadStatus.className = '';
        progressBar.style.width = '0%';
        
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            progressBar.style.width = '100%';
            return response.json();
        })
        .then(data => {
            if (data.success) {
                displayResults(data);
                uploadStatus.innerHTML = 'Analysis completed successfully';
                uploadStatus.className = 'success';
            } else {
                throw new Error(data.error || 'Analysis failed');
            }
        })
        .catch(error => {
            uploadStatus.innerHTML = error.message;
            uploadStatus.className = 'error';
        })
        .finally(() => {
            uploadBtn.disabled = false;
        });
    }
    
    function displayResults(data) {
        const resultsDiv = document.getElementById('results');
        const resultsContent = document.getElementById('resultsContent');
        
        // Clear previous results
        resultsContent.innerHTML = '';
        
        // Display summary statistics
        const positiveCount = data.predictions.filter(p => p === 1).length;
        const totalCount = data.predictions.length;
        const positivePercentage = ((positiveCount / totalCount) * 100).toFixed(2);
        
        resultsContent.innerHTML = `
            <div class="result-summary">
                <h3>Summary</h3>
                <p>Total samples analyzed: ${totalCount}</p>
                <p>Positive predictions: ${positiveCount} (${positivePercentage}%)</p>
                <p>Negative predictions: ${totalCount - positiveCount} (${(100 - positivePercentage).toFixed(2)}%)</p>
                <p class="accuracy-report">Model Accuracy: <span class="accuracy-value">${data.accuracy}%</span></p>
            </div>
        `;
        
        // Create prediction chart
        createPredictionChart(positiveCount, totalCount - positiveCount);
        
        // Display patient indices
        displayPatientIndices(data.positive_indices, data.negative_indices);
        
        // Display correlation heatmap
        displayCorrelationHeatmap(data.correlation_matrix, data.feature_names);
        
        resultsDiv.style.display = 'block';
    }
    
    function createPredictionChart(positiveCount, negativeCount) {
        const ctx = document.getElementById('predictionChart').getContext('2d');
        
        // Destroy previous chart if it exists
        if (predictionChart) {
            predictionChart.destroy();
        }
        
        predictionChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Heart Disease Present', 'Heart Disease Absent'],
                datasets: [{
                    data: [positiveCount, negativeCount],
                    backgroundColor: ['#ff6384', '#36a2eb'],
                    hoverBackgroundColor: ['#ff6384', '#36a2eb']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    position: 'bottom'
                }
            }
        });
    }
    
    function displayPatientIndices(positiveIndices, negativeIndices) {
        const indicesDiv = document.createElement('div');
        indicesDiv.className = 'indices-container';
        
        // Create positive indices section
        const positiveSection = document.createElement('div');
        positiveSection.className = 'indices-section positive';
        positiveSection.innerHTML = `
            <h4>Patients Predicted with Heart Disease</h4>
            <p>Patient IDs: ${positiveIndices.join(', ')}</p>
        `;
        
        // Create negative indices section
        const negativeSection = document.createElement('div');
        negativeSection.className = 'indices-section negative';
        negativeSection.innerHTML = `
            <h4>Patients Predicted without Heart Disease</h4>
            <p>Patient IDs: ${negativeIndices.join(', ')}</p>
        `;
        
        indicesDiv.appendChild(positiveSection);
        indicesDiv.appendChild(negativeSection);
        
        // Add to results content
        document.getElementById('resultsContent').appendChild(indicesDiv);
    }
    
    function displayCorrelationHeatmap(correlationMatrix, featureNames) {
        const correlationHeatmapDiv = document.getElementById('correlationHeatmap');
        
        const trace = {
            z: correlationMatrix,
            x: featureNames,
            y: featureNames,
            type: 'heatmap',
            colorscale: 'Viridis',
            showscale: true,
            text: correlationMatrix.map(row => row.map(value => value.toFixed(2))),
            hoverinfo: 'text'
        };
        
        const layout = {
            title: 'Correlation Heatmap',
            xaxis: {
                title: 'Features'
            },
            yaxis: {
                title: 'Features'
            }
        };
        
        Plotly.newPlot(correlationHeatmapDiv, [trace], layout);
    }
});

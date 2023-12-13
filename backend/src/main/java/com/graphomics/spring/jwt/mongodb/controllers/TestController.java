package com.graphomics.spring.jwt.mongodb.controllers;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;


import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.graphomics.spring.jwt.mongodb.models.FileItem;
import com.graphomics.spring.jwt.mongodb.models.Node;
import com.graphomics.spring.jwt.mongodb.models.NodeInput;
import com.graphomics.spring.jwt.mongodb.models.NodeOutput;
import com.graphomics.spring.jwt.mongodb.models.Relationship;
import com.graphomics.spring.jwt.mongodb.models.Tutorial;
import com.graphomics.spring.jwt.mongodb.models.Workflow;
import com.graphomics.spring.jwt.mongodb.models.WorkflowProcessState;
import com.graphomics.spring.jwt.mongodb.repository.TutorialRepository;
import com.graphomics.spring.jwt.mongodb.repository.WorkflowProcessStateRepository;
import com.graphomics.spring.jwt.mongodb.repository.WorkflowRepository;
import com.graphomics.spring.jwt.mongodb.security.services.Neo4jConfig;
import com.graphomics.spring.jwt.mongodb.service.FolderService;
import com.graphomics.spring.jwt.mongodb.service.KafkaProducerService;
import com.graphomics.spring.jwt.mongodb.service.RelationshipService;
import com.graphomics.spring.jwt.mongodb.service.WorkflowProcessor;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.InsertManyOptions;
import com.mongodb.client.model.Projections;
import com.mongodb.client.model.Sorts;
import com.opencsv.CSVReader;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.bson.Document;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.FileSystemResource;
import org.neo4j.driver.Driver;
import org.neo4j.driver.Result;
import org.neo4j.driver.Record;
import org.neo4j.driver.Session;
import org.neo4j.driver.Transaction;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class TestController {
	@GetMapping("/all")
	public String allAccess() {
		return "Public Content.";
	}
	

	private static final String NOTEBOOKS_DIRECTORY = "C:\\scripts\\notebooks";

	
	  
	@Autowired
    private KafkaProducerService kafkaProducerService;

  
	@Autowired
    private MongoTemplate mongoTemplate;
	@Autowired
	TutorialRepository tutorialRepository;
	 @Autowired
    private WorkflowRepository workflowRepository;

	@Autowired
	Neo4jConfig neo4jConfig;
	@Value("${upload.data-dir}")
	private String inputDataDirectory;
	@Autowired
	private RelationshipService service;

 	@Autowired
    private WorkflowProcessStateRepository workflowProcessStateRepository;


	@Value("${upload.scripts-dir}")
	private String scriptsDirectory;

	@GetMapping("/user")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public String userAccess() {
		return "User Content.";
	}

	@GetMapping("/mod")
	@PreAuthorize("hasRole('MODERATOR')")
	public String moderatorAccess() {
		return "Moderator Board.";
	}

	@GetMapping("/admin")
	@PreAuthorize("hasRole('ADMIN')")
	public String adminAccess() {
		return "Admin Board.";
	}

	

// 	 @PostMapping("/saveWorkflow")
// 	 @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")

//     public ResponseEntity<String> saveWorkflow(@RequestBody JsonObject workflowRequest) {
//         try {
// 			System.out.println("asdasd");
//             Workflow workflow = new Workflow();
// 			System.out.println("asdasd");
//             workflow.setWorkflowName(workflowRequest.get("workflowName").getAsString());
// System.out.println("asdasd");
//           //  JsonArray jsonArray = new JsonArray();
           

//             workflow.setNodes(workflowRequest.get("nodes").getAsString());
//             System.out.println("asdasd" + workflow);
//             workflowRepository.save(workflow);
//             return ResponseEntity.ok("Workflow successfully saved");
//         } catch (Exception e) {
// 			System.out.println(e.getMessage());
//             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save workflow");
//         }
//     }
 @PostMapping("/executeWorkflow/{workflowName}")
 @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")

    public ResponseEntity<String> executeWorkflow(@PathVariable String workflowName) {
        // Execute the workflow processing asynchronously
        CompletableFuture.runAsync(() -> {
            processWorkflow(workflowName);
        });

        return ResponseEntity.ok("Workflow is being processed!");
    }

    private void processWorkflow(String workflowName) {
System.out.println("in process...");
		Document workflowConfig = fetchWorkflowByName(workflowName);
		List<Document> nodes = (List<Document>) workflowConfig.get("nodes");
		System.out.println("in process...");
		List<String> logs = new ArrayList<>();
		LocalDateTime startTime = LocalDateTime.now();
    
		// Add initial entry to the audit table with status "In Progress"
		ObjectId auditEntryId = createAuditEntry(workflowName, startTime, null, null, "In Progress", null);
	
		for (Document node : nodes) {
			String nodeType = node.getString("type");
			
			switch(nodeType) {
				case "CSVUpload":
					logs.add("Processing CSV upload node");
					// Handle CSV upload logic here
					break;
					
				case "ScriptingNode":
					logs.add("Executing script node");
					kafkaProducerService.sendMessage("test_topic", "message");
					
					String scriptOutput = executeScript(node);
					logs.add(scriptOutput);
					break;
					
				case "PushToNeo4j":
					logs.add("Pushing data to Neo4j");
					pushToNeo4j();
					break;
					
				default:
					logs.add("Unsupported node type: " + nodeType);
			}
		}
		  // End time
		  LocalDateTime endTime = LocalDateTime.now();
		  Duration executionTime = Duration.between(startTime, endTime);
		  
		  // Update the entry in the audit table
		  updateAuditEntry(auditEntryId, endTime, executionTime, "Complete", logs);
	  
		saveAuditLogs(workflowName, logs);
		System.out.println(logs);
	}
	
	private void pushToNeo4j() {
	}
    @PostMapping("/setupUpload")
    public ResponseEntity<String> handleFileUpload(@RequestParam("files") MultipartFile[] files) throws IllegalStateException, IOException {
        // Process uploaded files here
        for (MultipartFile file : files) {
            // Save or process the file
			File outputFile = new File("C:/scripts/" + file.getOriginalFilename());
                file.transferTo(outputFile);
            System.out.println("Received file: " + file.getOriginalFilename());
        }

        return ResponseEntity.ok("Files uploaded successfully");
    }

@GetMapping("/notebooks")
    public List<String> listNotebooks() {
        File folder = new File(NOTEBOOKS_DIRECTORY);
        return Arrays.stream(folder.listFiles())
                .filter(file -> file.isFile() && file.getName().endsWith(".ipynb"))
                .map(File::getName)
                .collect(Collectors.toList());
    }
  @GetMapping("/getipynb/{notebookName}")
    public ResponseEntity<Resource> getNotebook(@PathVariable String notebookName) throws MalformedURLException {
		Path fileStorageLocation =  Paths.get("C:\\scripts\\notebooks").toAbsolutePath().normalize();
		Path filePath = fileStorageLocation.resolve(notebookName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok().body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
	}
 

	
    @GetMapping("/convert/{notebookName}")
    public String convertNotebook(@PathVariable String notebookName) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "python", "-m", "nbconvert", "--to", "html",
                    NOTEBOOKS_DIRECTORY + "/" + notebookName,
                    "--stdout"
            );
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            StringBuilder output = new StringBuilder();
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream())
            );

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            int exitVal = process.waitFor();
            if (exitVal == 0) {
                return output.toString();
            } else {
                // Handle the error
                return "Error in converting notebook";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Server error";
        }
    }


	private String executeScript(Document node) {
		Document config = (Document) node.get("config");
		boolean isUpload = config.getBoolean("isUpload");
		if (!isUpload) return "No script uploaded";
	
		String filePath = config.getString("filePath"); // Assuming you save file paths in the config
	
		StringBuilder output = new StringBuilder();
	
		try {
			ProcessBuilder pb;
			if (filePath.endsWith(".py")) {
				pb = new ProcessBuilder("python", filePath);
			} else if (filePath.endsWith(".R")) {
				pb = new ProcessBuilder("Rscript", filePath);
			} else {
				return "Unsupported script type";
			}
	
			Process p = pb.start();
			BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
			
			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line).append("\n");
			}
	System.out.println(output);
			p.waitFor();
	
		} catch (IOException | InterruptedException e) {
			e.printStackTrace();
			output.append("Error executing script: ").append(e.getMessage());
		}
	
		return output.toString();
	}

	private ObjectId createAuditEntry(String workflowName, LocalDateTime startTime, LocalDateTime endTime, Duration executionTime, String status, List<String> logs) {
    Document doc = new Document();
    doc.put("workflowName", workflowName);
    doc.put("startTime", startTime);
    doc.put("endTime", endTime);
    if (executionTime != null) {
        doc.put("executionTime", executionTime.toMillis()); // Storing in milliseconds, you can format it differently if needed
    }
    doc.put("status", status);
    doc.put("logs", logs);
    MongoCollection<Document> mongocolection= mongoTemplate.getCollection("workflowaudit");
    mongocolection.insertOne(doc);
    return doc.getObjectId("_id");
}

private void updateAuditEntry(ObjectId id, LocalDateTime endTime, Duration executionTime, String status, List<String> logs) {
    Document updateDoc = new Document();
    updateDoc.put("endTime", endTime);
    updateDoc.put("executionTime", executionTime.toMillis()); // Storing in milliseconds
    updateDoc.put("status", status);
    updateDoc.put("logs", logs);
MongoCollection<Document> mongocolection= mongoTemplate.getCollection("workflowaudit");
    mongocolection.updateOne(Filters.eq("_id", id), new Document("$set", updateDoc));
}

	@GetMapping("/getAudit")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
public List<Document> fetchAuditData() {
	MongoCollection<Document> mongoCollection= mongoTemplate.getCollection("workflowaudit");
    List<Document> documents = mongoCollection.find().into(new ArrayList<>());
    List<Document> responseList = new ArrayList<>();

    for (Document doc : documents) {
        Document responseDoc = new Document();
        responseDoc.put("workflowName", doc.getString("workflowName"));
        responseDoc.put("status", doc.getString("status"));
        // Assuming logs are stored as a file path. If not, adjust accordingly.
        //responseDoc.put("logsFilePath", doc.get("logs"));
 // Convert the logs list to a single string
 List<String> logsList = (List<String>) doc.get("logs");
 String logsString = String.join("\n", logsList);
 responseDoc.put("logs", logsString);
        responseList.add(responseDoc);
    }

    return responseList;
}


// @GetMapping("/getAudit")
// @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
// public List<Document> fetchAuditData() {
//     MongoCollection<Document> mongoCollection = mongoTemplate.getCollection("workflowaudit");
    
//     // Assuming you have a "timestamp" field in your documents
//     Bson sort = Aggregates.sort(Sorts.descending("timestamp"));
//     Bson groupFields = new Document("_id", "$workflowName")
//         .append("status", new Document("$first", "$status"))
//         .append("logsFilePath", new Document("$first", "$logs"))
//         .append("timestamp", new Document("$first", "$timestamp"));
    
//     Bson group = Aggregates.group("$workflowName", groupFields);

//     List<Document> responseList = mongoCollection.aggregate(Arrays.asList(sort, group)).into(new ArrayList<>());

//     return responseList;
// }
	private void saveAuditLogs(String workflowName, List<String> logs) {
		// Implement your logic to save the logs, either to a database or a file.
		String joinedLogs = String.join("\n", logs);
		// Save the 'joinedLogs' string to your desired location
	}

private Document fetchWorkflowByName(String workflowName) {
    Query query = new Query();
    query.addCriteria(Criteria.where("workflowName").is(workflowName));
    
    Document workflow = mongoTemplate.findOne(query, Document.class, "workflow");
    System.out.println("adsda"+workflow);
    if (workflow == null) {
        throw new RuntimeException("Workflow not found with name: " + workflowName);
    }
    
    return workflow;
}



	@PostMapping("/saveWorkflow")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<String> saveWorkflow(@RequestParam("workflowData") String workflowDataJson,
	@RequestParam Map<String, MultipartFile> files,
	HttpServletRequest request) throws IOException {
        Document document = Document.parse(workflowDataJson);
		// Document nodes = (Document) document.get("nodes");
		List<Document> nodes = (List<Document>) document.get("nodes"); 
		for (Map.Entry<String, MultipartFile> fileEntry : files.entrySet()) {
            String fileKey = fileEntry.getKey();
            if (fileKey.startsWith("file_")) {
                int nodeIndex = Integer.parseInt(fileKey.split("_")[1]) - 1; // Convert file_1 to 0, file_3 to 2, etc.
                Document node = (Document) nodes.get(nodeIndex);

                MultipartFile file = fileEntry.getValue();

                // Save the file to c:/scripts
                File outputFile = new File("C:/scripts/" + file.getOriginalFilename());
                file.transferTo(outputFile);

                // Update the node's config with the saved file path
                Document config = (Document) node.get("config");
                config.put("filePath", outputFile.getAbsolutePath());
            }
        }
		// Here "yourCollectionName" can be dynamic or you can inject it from properties too
		mongoTemplate.insert(document, "workflow");
         
		
		// Handle the file if you want. For instance, save it to disk, database, etc.

		// Return a success response
		return ResponseEntity.ok("Workflow saved successfully!");
    }

  


	@GetMapping("/getWorkflows")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<JsonArray> getAllWorkflows() {
		System.out.println("in the data");
		List<String> names = new ArrayList<>();

		JsonArray workflowNames = new JsonArray();
 MongoCollection<Document> collection = mongoTemplate.getCollection( "workflow");
            // Query the collection and project only the 'workflowName' field
            for (Document document : collection.find().projection(Projections.fields(Projections.include("workflowName"), Projections.excludeId()))) {
                workflowNames.add(document.getString("workflowName"));
            }
       
	
		return new ResponseEntity<>(workflowNames, HttpStatus.OK);
    }

		@GetMapping("/getNodes")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<JsonArray> getAllNodes() {
		System.out.println("in the data");
		List<String> names = new ArrayList<>();

		JsonArray nodes = new JsonArray();
 MongoCollection<Document> collection = mongoTemplate.getCollection( "nodes");
            // Query the collection and project only the 'workflowName' field
            try (MongoCursor<Document> cursor = collection.find().iterator()) {
        while (cursor.hasNext()) {
            Document document = cursor.next();
            // Convert MongoDB document to JSON using Gson or another library
            JsonObject json = new JsonParser().parse(document.toJson()).getAsJsonObject();
            nodes.add(json);
        }
    }
		return new ResponseEntity<>(nodes, HttpStatus.OK);
    }

	@GetMapping("/tutorials")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<List<Tutorial>> getAllTutorials(@RequestParam(required = false) String title) {
		try {
			List<Tutorial> tutorials = new ArrayList<Tutorial>();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
			if (title == null)
				tutorialRepository.findAll().forEach(tutorials::add);
			else
				tutorialRepository.findByTitleContaining(title).forEach(tutorials::add);

			if (tutorials.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}

			return new ResponseEntity<>(tutorials, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/tutorials/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<Tutorial> getTutorialById(@PathVariable("id") String id) {
		Optional<Tutorial> tutorialData = tutorialRepository.findById(id);

		if (tutorialData.isPresent()) {
			return new ResponseEntity<>(tutorialData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/upload-files")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<String> uploadFiles(@RequestParam("inputData") MultipartFile inputDataFile,
			@RequestParam("script") MultipartFile scriptFile) {
		try {
			// Save Input Data file
			Path inputDataPath = Paths.get(inputDataDirectory, inputDataFile.getOriginalFilename());
			inputDataFile.transferTo(new File(inputDataPath.toString()));

			// Save Script file
			Path scriptPath = Paths.get(scriptsDirectory, scriptFile.getOriginalFilename());
			scriptFile.transferTo(new File(scriptPath.toString()));

			return ResponseEntity.ok("Files uploaded successfully!");
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Failed to upload files!");
		}
	}

	@PostMapping("/tutorials")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<Tutorial> createTutorial(@RequestBody Tutorial tutorial) {
		try {
			Tutorial _tutorial = tutorialRepository
					.save(new Tutorial(tutorial.getTitle(), tutorial.getDescription(), false,
							tutorial.getLanguage(), tutorial.getScript(), tutorial.getParameters()));
			return new ResponseEntity<>(_tutorial, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/relationships")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public List<Relationship> getAllRelationships(@RequestParam(required = false, defaultValue = "0") int page,
			@RequestParam(required = false, defaultValue = "10") int size) {
		// PageRequest pageable = PageRequest.of(page, size);
		return service.findAll();
	}

    // @PostMapping("/executeWorkflow")
	// @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    // public void triggerKafka(@RequestBody JsonObject message) {
    //     kafkaProducerService.sendMessage(message.toString());
    // }

	@PostMapping("/relationships")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public Relationship createRelationship(@RequestBody Relationship relationship) {
		return service.save(relationship);
	}

	@DeleteMapping("/relationships/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public void deleteRelationship(@PathVariable String id) {
		service.deleteById(id);
	}

	@PostMapping("/csvload")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<Tutorial> loadCSV(@RequestBody Tutorial tutorial) {
		try {
			Tutorial _tutorial = tutorialRepository
					.save(new Tutorial(tutorial.getTitle(), tutorial.getDescription(), false,
							tutorial.getLanguage(), tutorial.getScript(), tutorial.getParameters()));
			return new ResponseEntity<>(_tutorial, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/csvheaderrelations")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<Tutorial> loadCSVrel(@RequestBody Tutorial tutorial) {
		try {
			Tutorial _tutorial = tutorialRepository
					.save(new Tutorial(tutorial.getTitle(), tutorial.getDescription(), false,
							tutorial.getLanguage(), tutorial.getScript(), tutorial.getParameters()));
			return new ResponseEntity<>(_tutorial, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	// delete labels selected in UI
	@PostMapping("/delLabelData")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<String> delLabel(@RequestBody JsonObject reqeust) throws IOException {
		JsonArray labelObj = reqeust.get("selectedOptions").getAsJsonArray();
		Driver driver = neo4jConfig.neo4jDriver();
		Session session = driver.session();
		Transaction tx = session.beginTransaction();
		String query = "";
		for (JsonElement label : labelObj) {
			query = "\'" + label.getAsString() + "\',";
		}
		query = query.substring(0, query.length() - 1);
		String finalQery = "MATCH (n) WHERE any(label in labels(n) WHERE label in [" + query + "]) DETACH DELETE n";
		tx.run(finalQery);

		tx.commit();
		// driver.close();
		return new ResponseEntity<>("OK", HttpStatus.ACCEPTED);
	}

	    @GetMapping("/folders")
    public FileItem getFolders() {
      
	   FileItem root = new FileItem();
        File rootDir = new File ("C:\\scripts");
        root.setName(rootDir.getName());
        root.setType("folder");
        root.setChildren(getChildren(rootDir));
        return root;
    }
	private List<FileItem> getChildren(File dir) {
        File[] files = dir.listFiles();
        List<FileItem> children = new ArrayList<>();
        if (files != null) {
            for (File file : files) {
                FileItem item = new FileItem();
                item.setName(file.getName());
                if (file.isDirectory()) {
                    item.setType("folder");
                    item.setChildren(getChildren(file));
                } else {
                    item.setType("file");
                }
                children.add(item);
            }
        }
        return children;
    }

	@PostMapping("/executenb/{notebookName}")
    public void executeNotebook(@PathVariable String notebookName) {
        try {


		String inFileath = "C:\\scripts\\notebooks\\" + notebookName;
		String outFileath = "C:\\scripts\\notebooks\\" + notebookName.replace(".ipynb", "")+ "_out.ipynb";
            ProcessBuilder processBuilder = new ProcessBuilder("python",
			 "C:\\scripts\\execute_notebook.py", inFileath,outFileath);
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(line);
                }
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Execution of notebook failed with exit code " + exitCode);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            throw new RuntimeException("Error executing the notebook", e);
        }
    }

		// delete labels selected in UI
	@PostMapping("/executeWfini")
	//@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public NodeOutput executeWorkflowini(@RequestBody JsonObject request) throws IOException {
	 List<Node> nodes = new ArrayList<>();

        // For each node name/type in the request, create and add the corresponding node
        for (JsonElement nodeName : request.get("nodeNames").getAsJsonArray()) {
			System.out.println("in script*********");
			if (nodeName.getAsString().equals("script")){
				System.out.println("in script*********");
				kafkaProducerService.sendMessage("test_topic", "message");
			}

			nodes.add(createNode(nodeName.getAsString()));
        }

        WorkflowProcessor processor = new WorkflowProcessor(nodes);
        return processor.runWorkflow("Initial Data");
		//return new ResponseEntity<>("OK", HttpStatus.ACCEPTED); 
	}



	private Node createNode(String nodeName) {
        // Based on the nodeName, instantiate the correct Node implementation
        // This is a placeholder - you should implement the logic to create specific node types
        //System.out.println("Creating node: " + nodeName);
        return new Node() {
            @Override
            public NodeOutput execute(NodeInput input) {
                System.out.println("Executing node: " + nodeName);
                return new NodeOutput("Output of " + nodeName);
            }
        };
    }


	// get the list the lables present in th Neo4j
	@PostMapping("/getLabelData")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<Resource> downloadFile(@RequestBody JsonArray labelObj) {
		// Define the file to download

		File file = getFile(labelObj);

		// Create a Resource object to represent the file
		Resource resource = new FileSystemResource(file);

		// Return a ResponseEntity with the file as a Resource
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
				.contentLength(file.length())
				.contentType(MediaType.APPLICATION_PDF)
				.body(resource);
	}

	private File getFile(JsonArray labelObj) {
		String query = "";
		Driver driver = neo4jConfig.neo4jDriver();
		Session session = driver.session();
		Transaction tx = session.beginTransaction();

		for (JsonElement label : labelObj) {
			query = "\'" + label.getAsString() + "\',";
		}
		query = query.substring(0, query.length() - 1);
		String finalquery = "MATCH (startNode)-[r]->(endNode) WHERE  any(label in labels(startNode) " +
				"WHERE label in [" + query + "]) or any(label in labels(endNode) WHERE label in [" + query +
				"]) RETURN type(r) AS relationshipType, startNode.name AS startNode, (endNode.name) AS endNode";
		Result result = session.run(query);
		result.list();
		return null;
	}

	private static void createFile(Result result) {
		try (BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {
			while (result.hasNext()) {
				Record record = result.next();
				String name = record.get("startNode").asString() + "\t" + record.get("relationshipType").asString()
						+ "\t"
						+ record.get("endNode").asString();
				writer.write(name);
				writer.newLine();
			}
			// File file = new File(Paths.get("output.txt"));
		} catch (IOException e) {
			System.err.format("IOException: %s%n", e);
		}
	}

	// edit relationship between labels
	@PostMapping("/editRel")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<String> editRel(@RequestBody JsonObject relObj) throws IOException {

		Driver driver = neo4jConfig.neo4jDriver();
		Session session = driver.session();
		Transaction tx = session.beginTransaction();
		relObj.get("startNodeLabel").getAsString();
		relObj.get("relationshipType").getAsString();
		relObj.get("endNodeLabel").getAsString();

		String query = "MATCH (a:" + relObj.get("startNodeLabel").getAsString() + ") - [r:%] -> (b:"
				+ relObj.get("endNodeLabel").getAsString() + ") DELETE r CREATE (a) - [:"
				+ relObj.get("relationshipType").getAsString() + "] -> (b)";
		tx.run(query);

		tx.commit();
		// driver.close();
		return new ResponseEntity<>("OK", HttpStatus.CREATED);
	}

	// upload the CSV files to create nodes and respective relations between labels
	@PostMapping("/upload-csv")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<String> handleFileUpload(@RequestParam("csvFile") MultipartFile file,
			@RequestParam("relation") String rel) {
		if (file.isEmpty()) {
			return ResponseEntity.badRequest().body("No file was uploaded.");
		}
		Gson gson = new Gson();
		try {
			String csv = new String(file.getBytes(), StandardCharsets.UTF_8);
			List<String> lines = Arrays.asList(csv.split("\n"));
			List<String> headers = Arrays.asList(lines.get(0).split(","));
			JsonArray jsonArray = gson.fromJson(rel, JsonArray.class);

			System.out.println(jsonArray);
			System.out.println(rel);
			createRelationships(jsonArray, csv);
			return ResponseEntity.ok(csv);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading file.");
		}
	}

	// Get list of exisitng realtionships between the labels
	@GetMapping("/getRel")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public JsonArray getRelationships() {
		JsonArray jsonArray = new JsonArray();
		String query = "MATCH (a)-[r]->(b) RETURN DISTINCT labels(a) AS startNodeLabel, type(r) AS relationshipType, labels(b) AS endNodeLabel";
		Driver driver = neo4jConfig.neo4jDriver();
		// GraphDatabase.driver("bolt://localhost:7687",AuthTokens.basic("neo4j",
		// "Pass@123"));
		Session session = driver.session();

		Result result = session.run(query);
		int id = 1;
		while (result.hasNext()) {
			Record record = result.next();
			String startNodeLabel = record.get("startNodeLabel").asList().get(0).toString();
			String relationshipType = record.get("relationshipType").asString();
			String endNodeLabel = record.get("endNodeLabel").asList().get(0).toString();
			JsonObject jsonObj = new JsonObject();
			jsonObj.addProperty("startNodeLabel", startNodeLabel);
			jsonObj.addProperty("relationshipType", relationshipType);
			jsonObj.addProperty("endNodeLabel", endNodeLabel);
			jsonObj.addProperty("id", "" + id);
			jsonArray.add(jsonObj);
			id = id + 1;
		}
		return jsonArray;
	}

	@GetMapping("/getLabels")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public JsonArray getLabels() {
		JsonArray jsonArray = new JsonArray();
		String query = "call db.labels()";
		Driver driver = neo4jConfig.neo4jDriver();
		Session session = driver.session();

		Result result = session.run(query);
		while (result.hasNext()) {
			Record record = result.next();
			String label = record.get("label").asString();
			jsonArray.add(label);

		}
		// driver.close();
		return jsonArray;
	}

	// @PostMapping("/execute")
	// public ResponseEntity<Tutorial> createDBEntry() {
	// try {
	// System.out.println("test in ");
	// String connectionString = "mongodb://localhost:27017"; // your MongoDB
	// connection string
	// String databaseName = "graphomics_db"; // your MongoDB database name
	// String collectionName = "new_wf"; // your MongoDB collection name
	// String csvFilePath = "E:/BIONOME_WS/Final/output.csv";
	// MongoClient mongoClient = MongoClients.create(connectionString);
	// MongoDatabase database = mongoClient.getDatabase(databaseName);
	// System.out.println("test in ");
	// MongoCollection<Document> collection =
	// database.getCollection(collectionName);
	// System.out.println("test in ");
	// // read the CSV file and insert its contents into the collection
	// CSVReader csvReader = new CSVReader(new FileReader(csvFilePath));
	// String[] headers = csvReader.readNext(); // read the header row of the CSV
	// file
	// List<Document> documents = new ArrayList<>();
	// String[] nextLine;
	// while ((nextLine = csvReader.readNext()) != null) {
	// Document document = new Document();
	// for (int i = 0; i < headers.length; i++) {
	// document.append(headers[i], nextLine[i]); // create a document from each row
	// of the CSV file
	// }
	// documents.add(document);
	// }
	// csvReader.close();
	// System.out.println("test in ");
	// collection.insertMany(documents, new InsertManyOptions().ordered(false)); //
	// insert the documents into the collection
	// System.out.println("test in ");
	// // close the MongoDB client
	// mongoClient.close();
	// System.out.println("over ");
	// return new ResponseEntity<>( HttpStatus.CREATED);
	// } catch (Exception e) {
	// return new ResponseEntity<>( HttpStatus.INTERNAL_SERVER_ERROR);
	// }
	// }

	private void createRelationships(JsonArray jsonArray, String csv) {
		List<String> lines = Arrays.asList(csv.split("\n"));

		Driver driver = neo4jConfig.neo4jDriver();
		Session session = driver.session();
		Transaction tx = session.beginTransaction();
		String cvsSplitBy = ",";
		List<String[]> dataList = new ArrayList<>();
		boolean firstLine = true;
		String[] headers = null;
		for (String line : lines) {
			if (firstLine) {
				headers = line.split(cvsSplitBy);
				firstLine = false;
			}
			String[] data = line.split(cvsSplitBy);
			dataList.add(data);
		}
		List<Set<String>> columnValues = new ArrayList<>();
		for (int i = 0; i < headers.length; i++) {
			columnValues.add(new HashSet<String>());
		}
		for (String[] data : dataList) {
			for (int i = 0; i < data.length; i++) {
				columnValues.get(i).add(data[i]);
			}
		} // print out the unique values for each column
		for (int i = 1; i < headers.length; i++) {
			// System.out.println("Column " + (i + 1) + " (" + headers[i] + "):");
			for (String value : columnValues.get(i)) {

				tx.run("CREATE (n:" + headers[i] + "{name: '" + value + "'})   ");
				// System.out.println("- " + value);
			}
			System.out.println();
		}
		tx.commit();
		// driver.close();
		Driver driver1 = neo4jConfig.neo4jDriver();
		Session session1 = driver1.session();
		Transaction tx1 = session1.beginTransaction();
		// for (int i = 1; i < headers.length - 1; i ++) {
		// String value1 = headers[i];
		// String value2 = headers[i - 1];
		// tx1.run("MATCH (a: "+value2 +") MATCH (b: "+value1+") CREATE
		// (a)-[rel:IS_CHILDOF]->(b)");
		// // do something with the values
		// }

		for (JsonElement ele : jsonArray) {
			JsonObject rel = ele.getAsJsonObject();
			tx1.run((("MATCH (a:" + rel.get("header1").toString() + ") MATCH (b:" + rel.get("header2").toString()
					+ ") CREATE (a)-[rel:" + rel.get("relation") + "]->(b)").replace("\"", "")).replace("\r", ""));
		}
		tx1.commit();
		/// driver1.close();
	}



		public static String convertToFlatJSON(String responseData) {
			JsonParser jsonParser = new JsonParser();
			JsonArray jsonArray = jsonParser.parse(responseData).getAsJsonArray();
			JsonArray flatArray = new JsonArray();
	
			for (JsonElement element : jsonArray) {
				if (element.isJsonObject()) {
					JsonObject jsonObject = element.getAsJsonObject();
	
					// Check if it's a nested object
					if (containsNestedObject(jsonObject)) {
						flatArray.addAll(flattenNestedObject(jsonObject));
					} else {
						// It's already flat, so keep it as is
						flatArray.add(jsonObject);
					}
				}
			}
	
			return flatArray.toString();
		}
	
		private static boolean containsNestedObject(JsonObject jsonObject) {
			for (String key : jsonObject.keySet()) {
				JsonElement value = jsonObject.get(key);
				if (value.isJsonObject()) {
					return true;
				}
			}
			return false;
		}
	
		private static JsonArray flattenNestedObject(JsonObject jsonObject) {
			JsonArray flatArray = new JsonArray();
			for (String key : jsonObject.keySet()) {
				JsonElement value = jsonObject.get(key);
				if (value.isJsonObject()) {
					JsonObject nestedObject = value.getAsJsonObject();
					JsonObject flatObject = new JsonObject();
					for (String nestedKey : nestedObject.keySet()) {
						flatObject.addProperty(key + "." + nestedKey, nestedObject.get(nestedKey).getAsString());
					}
					flatArray.add(flatObject);
				} else {
					flatArray.add(jsonObject);
				}
			}
			return flatArray;
		}
	
	
	@PostMapping("/execute")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<Tutorial> execute() {
		try {
			List<Tutorial> tutorials = new ArrayList<Tutorial>();
			tutorialRepository.findAll().forEach(tutorials::add);
			String finalCommadn = "";
			List<String> argList = new ArrayList<>();
			for (Tutorial tutoroal : tutorials) {

				// String scriptname = "E:/BIONOME_WS/Final/" + tutoroal.getScript();
				String scriptname = "C:/scripts/" + tutoroal.getScript();
				argList.add(scriptname);

			}
			// Build the command to launch PowerShell and execute your script with arguments
			List<String> command = new ArrayList<>();
			command.add("powershell.exe");
			command.add("-ExecutionPolicy");
			command.add("Bypass");
			command.add("-File");
			// command.add("E:/BIONOME_WS/Final/mainpwsh.ps1");

			command.add("C:/scripts/mainpwsh.ps1");
			command.addAll(argList);

			// Launch the PowerShell process
			// ProcessBuilder pb = new ProcessBuilder("powershell.exe", "-File", "E:/BIONOME
			// WS/Final/mainpwsh.ps1");
			ProcessBuilder pb = new ProcessBuilder(command);
			Process ps = pb.start();

			// BufferedReader reader = new BufferedReader(new
			// InputStreamReader(ps.getInputStream()));
			// StringBuilder output = new StringBuilder();
			// String line;
			// while ((line = reader.readLine()) != null) {
			// output.append(line + "\n"); // capture the output of the PowerShell script
			// }
			// String scriptOutput = output.toString();
			System.out.println(argList);
			// Wait for the process to finish
			int exitCode = ps.waitFor();
			System.out.println(exitCode);

			// Check if the script executed successfully
			if (exitCode == 0) {

				upload();
				System.out.println("PowerShell script executed successfully.");
			} else {
				System.out.println("PowerShell script failed to execute. Exit code: " + exitCode);
			}
			return new ResponseEntity<>(null, HttpStatus.CONTINUE);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/nltocypher")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public JsonObject executetest(@RequestBody JsonObject dataObject ) {
		try {
			List<Tutorial> tutorials = new ArrayList<Tutorial>();
			tutorialRepository.findAll().forEach(tutorials::add);
			String finalText = dataObject.get("query").getAsString();
			List<String> argList = new ArrayList<>();
			// for (Tutorial tutoroal : tutorials) {

			// 	// String scriptname = "E:/BIONOME_WS/Final/" + tutoroal.getScript();
			// 	String scriptname = "C:/scripts/testpara.py" ;
			// 	argList.add(scriptname);

			// }
			// Build the command to launch PowerShell and execute your script with arguments
	
// System.out.println("inside ");
			// Launch the PowerShell process
			ProcessBuilder pb = new ProcessBuilder("python", "E:/BIONOME_WS/nl2cy/testpara.py",finalText);
			
			Process ps = pb.start();

			StringBuilder output = new StringBuilder();
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(ps.getInputStream())
            );

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line + "\n");
            }

            int exitCode = ps.waitFor();
			JsonObject jy = new JsonObject();
            if (exitCode == 0) {
				jy.addProperty("query",	output.toString());
                return jy;
				
            } else { 
                return null;
            }
			
			

		
		} catch (Exception e) {
			return null;
		}
	}

	@PostMapping("/runQuery")
		@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public List<Map<String, Object>> runQuery(@RequestBody JsonObject cypherQuery) {
		System.out.println(cypherQuery);
		String queryv=cypherQuery.get("query").toString().replaceAll("\"","");
        List<Map<String, Object>> resultList = new ArrayList<>();
			Driver driver = neo4jConfig.neo4jDriver();
		Session session = driver.session();
       
            Result result = session.run(queryv);
            while (result.hasNext()) {
                resultList.add(result.next().asMap());
            }
        System.out.println(resultList);
        return resultList;
    }


	@PostMapping("/llm")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public JsonObject executeLlm(@RequestBody JsonObject dataObject ) {
		try {
			System.out.println("reached ");
			String cypherQuery = null;
			String fullContext  = null;
			List<Tutorial> tutorials = new ArrayList<Tutorial>();
			tutorialRepository.findAll().forEach(tutorials::add);
			String finalText = dataObject.get("query").getAsString();
			List<String> argList = new ArrayList<>();
			// for (Tutorial tutoroal : tutorials) {

			// 	// String scriptname = "E:/BIONOME_WS/Final/" + tutoroal.getScript();
			// 	String scriptname = "C:/scripts/testpara.py" ;
			// 	argList.add(scriptname);

			// }
			// Build the command to launch PowerShell and execute your script with arguments
	
// System.out.println("inside ");
			// Launch the PowerShell process
			// ProcessBuilder pb = new ProcessBuilder("python", "E:/BIONOME_WS/nl2cy/langtry.py",finalText);
			ProcessBuilder pb = new ProcessBuilder("python", "C:/scripts/langtry.py",finalText);

			
			Process ps = pb.start();

			StringBuilder output = new StringBuilder();
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(ps.getInputStream())
            );

            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line + "\n");
            }
System.out.println(output.toString());
            int exitCode = ps.waitFor();
			JsonObject jy = new JsonObject();
            if (exitCode == 0) {
				jy.addProperty("query",	output.toString());
				System.out.println(output.toString());
String ansiEscapeRegex = "\u001B\\[[;\\d]*m";

        // Remove ANSI escape codes from the input string
        String cleanString = output.toString().replaceAll(ansiEscapeRegex, "");
				String cypherRegex = "Generated Cypher:(.*?)Full Context:";
				String fullContextRegex = "Context:(.*?)>";
				String finishedChainRegex = "Finished chain.(.*)";
		// Extract Cypher query
        Pattern cypherPattern = Pattern.compile(cypherRegex, Pattern.DOTALL);
        Matcher cypherMatcher = cypherPattern.matcher(cleanString);
        if (cypherMatcher.find()) {
             cypherQuery = cypherMatcher.group(1).trim();
           jy.addProperty("query", cypherQuery);
		   System.out.println(cypherQuery);
        }

        // Extract Full Context
        Pattern fullContextPattern = Pattern.compile(fullContextRegex, Pattern.DOTALL);
        Matcher fullContextMatcher = fullContextPattern.matcher(cleanString);
        if (fullContextMatcher.find()) {
             fullContext = fullContextMatcher.group(1).trim();
           
		//	String ansiEscapeRegex = "\u001B\\[[;\\d]*m";

        // Remove ANSI escape codes from the input string
       // String cleanString = fullContext.replaceAll(ansiEscapeRegex, "");
			  System.out.println(cleanString);
        }
	String nodeExtractorRegex = "\\((\\w+:[^)]+)\\) ";
 	Pattern nodeExtractor = Pattern.compile(nodeExtractorRegex, Pattern.DOTALL);
	 Matcher nodeMatcher = nodeExtractor.matcher(cypherQuery);

 	if (nodeMatcher.find()) {

		for (int i =1; i>0 ;i++){
			String match = nodeMatcher.group(i).trim();
			if(match == null){
				break;
			} else {
				String [] nodeData = match.split(":");
				fullContext = fullContext.replace(nodeData[0]+".",nodeData[1]+".");
			}
			
		}
		//nodeMatcher.group(1).trim();

	}
	
 jy.addProperty("fullContext", convertToFlatJSON(fullContext.replace("\'","\"")));
		
        // Extract Finished chain (consider all data after "Finished chain")
        Pattern finishedChainPattern = Pattern.compile(finishedChainRegex, Pattern.DOTALL);
        Matcher finishedChainMatcher = finishedChainPattern.matcher(cleanString);
        if (finishedChainMatcher.find()) {
            String finishedChain = finishedChainMatcher.group(1).trim();
             jy.addProperty("bottom",finishedChain );
			 System.out.println(finishedChain);
        }
                return jy;
				
            } else { 
                return null;
            }
			
			

		
		} catch (Exception e) {
			return null;
		}
	}



	public ResponseEntity<Tutorial> upload() {
		try {
			System.out.println("test in ");
			String connectionString = "mongodb+srv://testUser:UOR9qtWZ4DbItMPZ@cluster0.1cvzftz.mongodb.net"; // your
																												// MongoDB
																												// connection
																												// string
			String databaseName = "test"; // your MongoDB database name
			String collectionName = "new_wf"; // your MongoDB collection name
			// String csvFilePath = "E:/BIONOME_WS/Final/output.csv";
			String csvFilePath = "C:/scripts/output.csv";
			MongoClient mongoClient = MongoClients.create(connectionString);
			MongoDatabase database = mongoClient.getDatabase(databaseName);
			System.out.println("test in ");
			MongoCollection<Document> collection = database.getCollection(collectionName);
			System.out.println("test in ");
			// read the CSV file and insert its contents into the collection
			CSVReader csvReader = new CSVReader(new FileReader(csvFilePath));
			String[] headers = csvReader.readNext(); // read the header row of the CSV file
			List<Document> documents = new ArrayList<>();
			String[] nextLine;
			while ((nextLine = csvReader.readNext()) != null) {
				Document document = new Document();
				for (int i = 0; i < headers.length; i++) {
					document.append(headers[i], nextLine[i]); // create a document from each row of the CSV file
				}
				documents.add(document);
			}
			csvReader.close();
			System.out.println("test in ");
			collection.insertMany(documents, new InsertManyOptions().ordered(false)); // insert the documents into the
																						// collection
			System.out.println("test in ");
			// close the MongoDB client
			mongoClient.close();
			System.out.println("over ");
			return new ResponseEntity<>(HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/tutorials/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<Tutorial> updateTutorial(@PathVariable("id") String id, @RequestBody Tutorial tutorial) {
		Optional<Tutorial> tutorialData = tutorialRepository.findById(id);

		if (tutorialData.isPresent()) {
			Tutorial _tutorial = tutorialData.get();
			_tutorial.setTitle(tutorial.getTitle());
			_tutorial.setDescription(tutorial.getDescription());
			_tutorial.setPublished(tutorial.isPublished());
			_tutorial.setLanguage(tutorial.getLanguage());
			_tutorial.setScript(tutorial.getScript());
			_tutorial.setParameters(tutorial.getParameters());
			return new ResponseEntity<>(tutorialRepository.save(_tutorial), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/tutorials/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<HttpStatus> deleteTutorial(@PathVariable("id") String id) {
		try {
			tutorialRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/tutorials")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<HttpStatus> deleteAllTutorials() {
		try {
			tutorialRepository.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/tutorials/published")
	@PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
	public ResponseEntity<List<Tutorial>> findByPublished() {
		try {
			List<Tutorial> tutorials = tutorialRepository.findByPublished(true);

			if (tutorials.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(tutorials, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
